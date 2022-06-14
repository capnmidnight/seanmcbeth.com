using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SeanMcBeth.Pages
{
    public class AppModel : PageModel
    {
        private static readonly DirectoryInfo appRoot = 
            new DirectoryInfo("wwwroot").CD("js");

        public static readonly string[] AppNames =
            appRoot
                .EnumerateDirectories()
                .Where(d => d.Name.EndsWith("-app")
                    && d.Name.ToLowerInvariant() != "junk-app"
                    && d.Touch("index.js").Exists)
                .Select(d => d.Name[0..^4])
                .ToArray();

        [BindProperty(SupportsGet = true), FromRoute]
        public string? Name { get; set; }

        public bool IncludeThreeJS { get; private set; }

        public string ScriptPath => string.Join('/', "js", Name + "-app", "index.js");

        public async Task<IActionResult> OnGetAsync()
        {
            if (!AppNames.Contains(Name))
            {
                return NotFound();
            }

            IncludeThreeJS = await HasThreeJS();
            return Page();
        }

        private async Task<bool> HasThreeJS()
        {
            using var reader = appRoot
                .CD(Name + "-app")
                .Touch("index.js")
                .OpenText();

            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (line?.Contains("THREE.") == true)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
