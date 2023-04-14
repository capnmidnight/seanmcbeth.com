using Juniper.HTTP;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using System.Text.Json;

namespace SeanMcBeth.Pages
{
    [AttributeUsage(AttributeTargets.Class)]
    public class BundleTypeAttribute : Attribute
    {
        public BundleTypeAttribute(string typeName)
        {
            TypeName = typeName;
        }

        public string TypeName { get; }
    }

    public abstract class AbstractBundlePageModel<T> : PageModel
    {
        private static readonly JsonSerializerOptions SerializerOptions = new()
        {
            WriteIndented = true,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        private static string BundleTypeName
        {
            get
            {
                var type = typeof(T);
                var attr = type.GetCustomAttribute<BundleTypeAttribute>(true)
                    ?? throw new Exception($"{nameof(BundleTypeAttribute)} is not configured on the concrete page model class.");
                return attr.TypeName;
            }
        }

        private static DirectoryInfo BundlesRoot
        {
            get => new DirectoryInfo("wwwroot").CD("js", BundleTypeName);
        }

        public static string[] BundleNames
        {
            get => GetBundleNames(BundlesRoot);
        }

        protected static string[] GetBundleNames(DirectoryInfo dir) =>
            dir
                .EnumerateDirectories()
                .Where(d => d.Touch("index.js").Exists)
                .Select(d => d.Name)
                .OrderBy(d => d)
                .ToArray();

        private readonly IWebHostEnvironment env;

        protected AbstractBundlePageModel(IWebHostEnvironment env)
        {
            this.env = env;
        }

        [BindProperty(SupportsGet = true), FromRoute]
        public string? Name { get; set; }

        private DirectoryInfo BundleRoot => BundlesRoot.CD(Name);

        private string BundlePathRoot => string.Join('/', "js", "app", Name);

        private string? MapFile(string name)
        {
            return BundleRoot.Touch(name).Exists
                ? string.Join('/', "", BundlePathRoot, name)
                : null;
        }

        public string? ScreenshotPath => MapFile("screenshot.jpg");
        private string? LogoPath => MapFile("screenshot.jpg");
        private string? LogoSmallPath => MapFile("screenshot.jpg");
        public string? FullName => BundleRoot.Touch("name.txt").MaybeReadText();
        public string? Description => BundleRoot.Touch("description.txt").MaybeReadText();
        public bool IncludeThreeJS => BundleRoot.Touch("includeThreeJS.bool").Exists;
        public bool IncludeStylesheet => BundleRoot.Touch("index.css").Exists;
        public bool HideMenu => BundleRoot.Touch("hideMenu.bool").Exists;

        public string? ManifestPath =>
            ScreenshotPath is not null
            && LogoPath is not null
            && LogoSmallPath is not null
            && FullName is not null
            && Description is not null
            ? $"/{BundleTypeName}/{Name}.webmanifest"
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

            if (!BundleNames.Contains(Name))
            {
                return NotFound();
            }

            if (sendWebManifest)
            {
                var start = $"/{BundleTypeName}/{Name}";
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

                if (ScreenshotPath is not null)
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

                if (LogoPath is not null || LogoSmallPath is not null)
                {
                    var icons = new List<WebAppManifestImage>();
                    if (LogoPath is not null)
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

                    manifest.Icons = icons.ToArray();
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
                return File("/js/workers/service/index" + JS_EXT, Juniper.MediaType.Application_Javascript);
            }
            else
            {
                return Page();
            }
        }

#if DEBUG
        private static readonly DirectoryInfo SrcsRoot = new("src");
        private DirectoryInfo SrcRoot => SrcsRoot.CD(BundleTypeName, Name);
        private FileInfo ScreenshotFile => SrcRoot.Touch("screenshot.jpg");

        public async Task<IActionResult> OnPostAsync([FromForm] SingleFormFile input)
        {
            if (!env.IsDevelopment()
                || input is null
                || input.FormFile is null)
            {
                return NotFound();
            }

            using var fileStream = ScreenshotFile.OpenWrite();
            await input.FormFile.CopyToAsync(fileStream);
            await fileStream.FlushAsync();
            return new OkResult();
        }
#endif
    }
}
