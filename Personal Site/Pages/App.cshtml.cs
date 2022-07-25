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

        public string ThumbnailPath => string.Join('/', "js", Name + "-app", "thumbnail.jpg");

        private FileInfo DescriptionFile => AppRoot.Touch("description.txt");

        public string? Description => DescriptionFile.MaybeReadText();

        public IActionResult OnGet()
        {
            if (!AppNames.Contains(Name))
            {
                return NotFound();
            }

            return Page();
        }

#if DEBUG
        private static readonly DirectoryInfo SrcsRoot =
            new DirectoryInfo("src");
        private DirectoryInfo SrcRoot => SrcsRoot.CD(Name + "-app");
        private FileInfo ThumbnailFile => SrcRoot.Touch("thumbnail.jpg");

        public async Task<IActionResult> OnPostAsync([FromForm] FileInput input)
        {
            if (!env.IsDevelopment()
                || input is null
                || input.File is null)
            {
                return NotFound();
            }

            using var fileStream = ThumbnailFile.OpenWrite();
            await input.File.CopyToAsync(fileStream);
            await fileStream.FlushAsync();
            return new OkResult();
        }
#endif
    }
}
