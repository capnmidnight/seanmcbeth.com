using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class DetailModel : EditorPageModel
    {
        public ScenarioGroup ScenarioGroup { get; private set; }

        public IEnumerable<Language> Languages { get; private set; }

        public IEnumerable<Organization> Organizations { get; private set; }

        public DetailModel(YarrowContext db, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "scenario", env, logger)
        {
        }

        public async Task<IActionResult> OnGetAsync(int scenarioGroupID)
        {
            if (!CurrentUser.IsEditor)
            {
                return Forbid();
            }

            try
            {
                ScenarioGroup = await Database.GetScenarioGroups(CurrentUser.VisibleOrganizationID, null, null, null)
                    .SingleOrDefaultAsync(sg => sg.Id == scenarioGroupID);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }

            Languages = Database.GetLanguages(CurrentUser.IsAdmin);
            if (CurrentUser.IsAdmin)
            {
                Organizations = Database.Organizations.OrderBy(o => o.Name);
            }

            return Page();
        }

        public Task<IActionResult> OnPostUpdateAsync(int scenarioGroupID, [FromForm] ScenarioInputModel input) =>
            WithStatusReportAsync("update",
                () => OnGetAsync(scenarioGroupID),
                async () =>
                {
                    if (input is null)
                    {
                        throw new InvalidOperationException("No input");
                    }

                    var messages = new List<string>();

                    var group = Database
                        .ScenarioGroups
                        .SingleOrDefault(scn => scn.Id == scenarioGroupID);
                    if (group.LanguageId != input.LanguageId)
                    {
                        messages.Add("Changed language.");
                        group.LanguageId = input.LanguageId;
                    }

                    if (group.Name != input.Name)
                    {
                        messages.Add("Changed name.");
                        group.Name = input.Name;
                    }

                    if (messages.Count > 0)
                    {
                        await Database.SaveChangesAsync();
                    }
                    else
                    {
                        messages.Add("No change.");
                    }

                    return string.Join("\n", messages);
                });

        public Task<IActionResult> OnPostDuplicateAsync(int scenarioGroupID) =>
            WithStatusReportAsync("duplicate",
                () => OnGetAsync(scenarioGroupID),
                async () =>
                {
                    var newScenarioGroup = await Database.DuplicateScenarioGroupAsync(CurrentUser.VisibleOrganizationID, scenarioGroupID, CurrentUser.UserID);
                    return $"redirect:~/Editor/Scenarios/Detail/{newScenarioGroup.Id}";
                });

        public record SetOrganizationInput(int OrganizationID);

        public Task<IActionResult> OnPostSetOrganizationAsync([FromRoute] int scenarioGroupID, [FromForm] SetOrganizationInput input) =>
            WithStatusReportAsync("set organization on",
                () => OnGetAsync(scenarioGroupID),
                async () =>
                {
                    if (input?.OrganizationID is null)
                    {
                        throw new InvalidOperationException("System error");
                    }

                    return await Database.ToggleScenarioInOrganization(input.OrganizationID, scenarioGroupID);
                });

        public Task<IActionResult> OnPostDeleteAsync(int scenarioGroupID) =>
            WithStatusReportAsync("delete",
                () => OnGetAsync(scenarioGroupID),
                async () =>
                {
                    var group = await Database.ScenarioGroups
                        .Include(g => g.Scenarios)
                        .Include(g => g.MenuItems)
                        .SingleOrDefaultAsync(g => g.Id == scenarioGroupID);

                    foreach (var scenario in group.Scenarios)
                    {
                        await Database.DeleteScenarioAsync(scenario);
                    }

                    Database.ScenarioGroups.Remove(group);
                    Database.MenuItems.RemoveRange(group.MenuItems);

                    await Database.SaveChangesAsync();

                    return "redirect:~/Editor/Scenarios";
                });
    }
}