using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Languages
{
    public class IndexModel : EditorPageModel
    {
        public IEnumerable<Language> Languages { get; private set; }

        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "language", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsEditor)
            {
                return Forbid();
            }

            Languages = Database.GetLanguages(CurrentUser.IsAdmin);
            return Page();
        }

        public Task<IActionResult> OnPostCreateAsync([FromForm] LanguageInputModel input) =>
            WithStatusReportAsync("create",
                OnGet,
                async () =>
                {
                    var language = new Language
                    {
                        Name = input.Name
                    };
                    await Database.AddAsync(language);
                    await Database.SaveChangesAsync();
                    return $"redirect:~/Editor/Languages/Detail/{language.Id}";
                });
    }
}
