using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using SeanMcBeth.Models;

namespace SeanMcBeth.Pages
{
    public class AppModel : PageModel
    {
        private static readonly DirectoryInfo AppsRoot =
            new DirectoryInfo("wwwroot").CD("js");

        public static readonly string[] AppNames =
            AppsRoot
                .EnumerateDirectories()
                .Where(d => d.Name.EndsWith("-app")
                    && d.Touch("index.js").Exists)
                .Select(d => d.Name[0..^4])
                .OrderBy(d => d)
                .ToArray();

        private readonly IWebHostEnvironment env;

        public AppModel(IWebHostEnvironment env)
        {
            this.env = env;
        }

        [BindProperty(SupportsGet = true), FromRoute]
        public string? Name { get; set; }

        private DirectoryInfo AppRoot => AppsRoot.CD(Name + "-app");
        private string AppPathRoot => string.Join('/', "js", Name + "-app");

        private string? MapFile(string name)
        {
            return AppRoot.Touch(name).Exists
                ? string.Join('/', AppPathRoot, name)
                : null;
        }

        public string? ScreenshotPath => MapFile("screenshot.jpg");
        public string? ManifestPath => MapFile("app.webmanifest");
        public string? Description => AppRoot.Touch("description.txt").MaybeReadText();

        public IActionResult OnGet()
        {
            var sendServiceWorker = Name?.EndsWith(".service") == true;
            Name = Name?.Replace(".service", "");

            if (!AppNames.Contains(Name))
            {
                return NotFound();
            }

            if (sendServiceWorker)
            {
                return File("/js/service-worker/index.js", Juniper.MediaType.Application_Javascript);
            }
            else
            {
                return Page();
            }
        }

#if DEBUG
        private static readonly DirectoryInfo SrcsRoot = new ("src");
        private DirectoryInfo SrcRoot => SrcsRoot.CD(Name + "-app");
        private FileInfo ScreenshotFile => SrcRoot.Touch("screenshot.jpg");

        public async Task<IActionResult> OnPostAsync([FromForm] FileInput input)
        {
            if (!env.IsDevelopment()
                || input is null
                || input.File is null)
            {
                return NotFound();
            }

            using var fileStream = ScreenshotFile.OpenWrite();
            await input.File.CopyToAsync(fileStream);
            await fileStream.FlushAsync();
            return new OkResult();
        }
#endif
    }
}
