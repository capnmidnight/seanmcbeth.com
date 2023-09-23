using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Files
{

    public class CreateModel : EditorPageModel
    {
        public IEnumerable<string> Tags { get; private set; }

        public CreateModel(YarrowContext db, IWebHostEnvironment env, ILogger<CreateModel> logger)
            : base(db, "file", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsEditor)
            {
                return Forbid();
            }

            Tags = Database.FileTags
                .AsNoTracking()
                .OrderBy(t => t.Name)
                .Select(t => t.Name);

            return Page();
        }

        public Task<IActionResult> OnPostAsync([FromForm] FileCreateInput fileUpload) =>
            WithStatusReportAsync("create",
                OnGet,
                async () =>
                {
                    var file = await Database.CreateFileAsync(fileUpload);
                    return $"redirect:~/Editor/Files/Detail/{file.Id}";
                });
    }
}
