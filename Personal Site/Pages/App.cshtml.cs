using Juniper.HTTP;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using SeanMcBeth.Models;

using System.Text.Json;

namespace SeanMcBeth.Pages
{
    public class AppModel : PageModel
    {
        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            WriteIndented = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

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
                ? string.Join('/', "", AppPathRoot, name)
                : null;
        }

        public string? ScreenshotPath => MapFile("screenshot.jpg");
        private string? LogoPath => MapFile("screenshot.jpg");
        private string? LogoSmallPath => MapFile("screenshot.jpg");
        public string? FullName => AppRoot.Touch("name.txt").MaybeReadText();
        public string? Description => AppRoot.Touch("description.txt").MaybeReadText();
        public bool IncludeThreeJS => AppRoot.Touch("includeThreeJS.bool").Exists;
        public bool IncludeStylesheet => AppRoot.Touch("index.css").Exists;

        public string? ManifestPath =>
            ScreenshotPath is not null
            && LogoPath is not null
            && LogoSmallPath is not null
            && FullName is not null
            && Description is not null
            ? $"/app/{Name}.webmanifest"
            : null;

        public IActionResult OnGet()
        {
            if (Name is null)
            {
                return NotFound();
            }

            var sendWebManifest = Name.EndsWith(".webmanifest") == true;
            var sendServiceWorker = Name.EndsWith(".service") == true;
            Name = Name
                .Replace(".webmanifest", "")
                .Replace(".service", "");

            if (!AppNames.Contains(Name))
            {
                return NotFound();
            }

            if (sendWebManifest)
            {
                var start = $"/app/{Name}";
                var manifest = new WebAppManifest
                {
                    ID = start,
                    StartUrl = start,
                    Scope = start,
                    Name = FullName ?? Name,
                    ShortName = Name,
                    Description = Description,
                    Display = "standalone",
                    Orientation = "any",
                    OVRPackageName = $"com.seanmcbeth.app.{Name}",
                    Language = "en_US"
                };

                if(ScreenshotPath is not null)
                {
                    manifest.Screenshots = new WebAppManifestImage[]
                    {
                        new ()
                        {
                            Source = ScreenshotPath,
                            Type = Juniper.MediaType.Image_Jpeg
                        }
                    };
                }

                if(LogoPath is not null || LogoSmallPath is not null)
                {
                    var icons = new List<WebAppManifestImage>();
                    if(LogoPath is not null)
                    {
                        icons.Add(new WebAppManifestImage
                        {
                            Source = LogoPath,
                            Type = Juniper.MediaType.Image_Png,
                            Sizes = "1200x1200"
                        });
                    }

                    if (LogoSmallPath is not null)
                    {
                        icons.Add(new WebAppManifestImage
                        {
                            Source = LogoSmallPath,
                            Type = Juniper.MediaType.Image_Png,
                            Sizes = "300x300"
                        });
                    }

                    manifest.Icons = icons.ToArray() ;
                }

                return new JsonResult(manifest, SerializerOptions);
            }
            else if (sendServiceWorker)
            {
#if DEBUG
                var JS_EXT = ".js";
#else
                var JS_EXT = ".min.js";
#endif
                return File("/js/service-worker/index" + JS_EXT, Juniper.MediaType.Application_Javascript);
            }
            else
            {
                return Page();
            }
        }

#if DEBUG
        private static readonly DirectoryInfo SrcsRoot = new("src");
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
