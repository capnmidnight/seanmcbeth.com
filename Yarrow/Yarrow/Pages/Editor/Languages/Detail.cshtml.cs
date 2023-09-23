using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Languages
{
    public class DetailModel : EditorPageModel
    {
        public Language Language { get; private set; }
        public bool HasScenarios { get; private set; }

        public DetailModel(YarrowContext db, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "language", env, logger)
        {
        }

        public async Task<IActionResult> OnGetAsync(int id)
        {
            if (!CurrentUser.IsEditor)
            {
                return Forbid();
            }

            Language ??= await Database.GetLanguageAsync(id);
            if(Language.Name == "Meta" && !CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            HasScenarios = Database.ScenarioGroups.Any(sg => sg.LanguageId == id);
            return Page();
        }

        public Task<IActionResult> OnPostUpdateAsync(int id, [FromForm] LanguageInputModel input) =>
            WithStatusReportAsync("update",
                () => OnGetAsync(id),
                async () =>
                {
                    Language = await Database.GetLanguageAsync(id);
                    var message = "No change.";
                    if (Language.Name != input.Name)
                    {
                        message = $"Language name changed from {Language.Name} to {input.Name}.";
                        Language.Name = input.Name;
                    }

                    await Database.SaveChangesAsync();
                    return message;
                });

        public Task<IActionResult> OnPostDeleteAsync(int id) =>
            WithStatusReportAsync("delete",
                () => OnGetAsync(id),
                async () =>
                {
                    var language = await Database.GetLanguageAsync(id);
                    Database.Remove(language);
                    await Database.SaveChangesAsync();
                    return "redirect:~/Editor/Languages";
                });
    }
}
