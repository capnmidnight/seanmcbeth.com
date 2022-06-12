using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SeanMcBeth.Pages
{
    public class AppModel : PageModel
    {
        public static readonly string[] AppNames =
            new DirectoryInfo("wwwroot")
                .CD("js")
                .EnumerateDirectories()
                .Where(d => d.Name.EndsWith("-app")
                    && d.Name.ToLowerInvariant() != "junk-app"
                    && d.Touch("index.js").Exists)
                .Select(d => d.Name[0..^4])
                .ToArray();

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
