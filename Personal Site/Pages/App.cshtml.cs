using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using System.Text.RegularExpressions;

namespace SeanMcBeth.Pages
{
    public class AppModel : PageModel
    {
        public static readonly IEnumerable<string> AppNames =
            new DirectoryInfo("wwwroot")
                .CD("js")
                .EnumerateDirectories()
                .Where(d => d.Name.EndsWith("-app"))
                .Select(d => d.Name[0..^4]);

        [BindProperty(SupportsGet = true), FromRoute]
        public string? Name { get; set; }

        public string ScriptPath => string.Join('/', "js", Name + "-app", "index.js");

        public IActionResult OnGet()
        {
            if (!AppNames.Contains(Name))
            {
                return NotFound();
            }

            return Page();
        }
    }
}
