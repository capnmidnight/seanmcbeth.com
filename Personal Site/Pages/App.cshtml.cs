using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using System.Text.RegularExpressions;

namespace SeanMcBeth.Pages
{
    public class AppModel : PageModel
    {
        [BindProperty(SupportsGet = true), FromRoute]
        public string Name { get; set; }

        public string ScriptPath => string.Join('/', "js", Name + "-app", "index.js");

        private static readonly Regex namePattern = new(@"\w+(?:-\w+)*", RegexOptions.Compiled);

        public IActionResult OnGet()
        {
            if (Name is null
                || !namePattern.IsMatch(Name)
                || !System.IO.File.Exists("wwwroot/" + ScriptPath))
            {
                return NotFound();
            }

            return Page();
        }
    }
}
