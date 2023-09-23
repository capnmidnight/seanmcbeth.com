using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Organizations
{
    public class DetailModel : EditorPageModel
    {
        public Organization Organization { get; private set; }

        public bool CanDelete { get; private set; }

        public DetailModel(YarrowContext db, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "organization", env, logger)
        {
        }

        public async Task<IActionResult> OnGetAsync([FromRoute] int id)
        {
            if (!CurrentUser.IsManager
                || (!CurrentUser.IsAdmin && CurrentUser.OrganizationID != id))
            {
                return Forbid();
            }

            Organization = await Database
                .Organizations
                .Include(org => org.Users)
                .SingleOrDefaultAsync(org => org.Id == id);

            if (Organization is null)
            {
                return NotFound();
            }

            CanDelete = !Organization.Users.Any();

            return Page();
        }

        public Task<IActionResult> OnPostSetUserAsync([FromRoute] int id, [FromForm] UserIDInput input) =>
            WithStatusReportAsync("set user on", () => OnGetAsync(id), async () =>
            {
                if (string.IsNullOrEmpty(input?.UserID))
                {
                    throw new Exception("System error");
                }

                var org = await Database
                    .Organizations
                    .SingleOrDefaultAsync(org => org.Id == id)
                    ?? throw new FileNotFoundException();

                var user = await Database
                    .UserProfiles
                    .Include(u => u.Organization)
                    .Include(u => u.User)
                    .SingleOrDefaultAsync(user => user.UserId == input.UserID)
                    ?? throw new FileNotFoundException(input.UserID);

                if (user.Organization is null)
                {
                    user.Organization = org;
                    await Database.SaveChangesAsync();
                    return $"User {user.User.Email} added to '{org.Name}'";
                }
                else if (user.Organization == org)
                {
                    user.Organization = null;
                    await Database.SaveChangesAsync();
                    return $"User {user.User.Email} removed from '{org.Name}'";
                }
                else
                {
                    var oldOrg = user.Organization;
                    user.Organization = org;
                    await Database.SaveChangesAsync();
                    return $"User {user.User.Email} removed from '{oldOrg.Name}' and added to {org.Name}";
                }
            });

        public record SetScenarioInput(int ScenarioGroupID);

        public Task<IActionResult> OnPostSetScenarioAsync([FromRoute] int id, [FromForm] SetScenarioInput input) =>
            WithStatusReportAsync("set scenario on", () => OnGetAsync(id), async () =>
            {
                if (input?.ScenarioGroupID is null)
                {
                    throw new Exception("System error");
                }

                return await Database.ToggleScenarioInOrganization(id, input.ScenarioGroupID);
            });

        public Task<IActionResult> OnPostDeleteAsync([FromRoute] int id) =>
            WithStatusReportAsync("delete",
                () => OnGetAsync(id),
                async () =>
                {
                    var org = await Database
                        .Organizations
                        .Include(org => org.Users)
                        .SingleOrDefaultAsync(org => org.Id == id);
                    if (org is null)
                    {
                        throw new FileNotFoundException("Organization not found");
                    }

                    if (org.Users.Count > 0)
                    {
                        throw new Exception("Organization still has users assigned");
                    }

                    Database.Organizations.Remove(org);
                    await Database.SaveChangesAsync();

                    return $"redirect:~/Editor/Organizations";
                });
    }
}
