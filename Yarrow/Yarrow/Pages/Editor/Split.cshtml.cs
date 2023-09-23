using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using Yarrow.Data;

using static System.Math;

namespace Yarrow.Pages.Editor
{
    public class SplitModel : EditorPageModel
    {
        [BindProperty(SupportsGet = true)]
        public string Path { get; set; }

        public string GetPath(int userIndex)
        {
            var sep = Path.Contains('?') ? '&' : '?';
            return $"{Path}{sep}testUserNumber={userIndex}";
        }

        [BindProperty(SupportsGet = true)]
        public int Count { get; set; } = 2;

        public int Width => (int)Ceiling(Sqrt(Count));

        public int Height => (int)Ceiling(Count / (float)Width);

        public SplitModel(YarrowContext db, IWebHostEnvironment env, ILogger<SplitModel> logger)
            : base(db, "test", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            return Page();
        }
    }
}