using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;

namespace Yarrow.Pages.Editor
{
    public class IndexModel : EditorPageModel
    {
        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<LogsModel> logger)
            : base(db, "index", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.CanViewBackend)
            {
                return Forbid();
            }

            return Page();
        }
    }
}
