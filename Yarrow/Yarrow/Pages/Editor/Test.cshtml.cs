using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using System.Text.RegularExpressions;

using Yarrow.Data;

namespace Yarrow.Pages.Editor
{
    public class TestModel : EditorPageModel
    {
        private static string AppRoot = string.Join('/', "wwwroot", "js", "tests");

        [BindProperty(SupportsGet = true), FromRoute]
        public string Name { get; set; }

        private string AppDirName => string.Join('/', AppRoot, Name);
        private string ScriptPath => string.Join('/', AppDirName, "index.js");
        private string StylePath => string.Join('/', AppDirName, "index.css");
        private string ThreeJSFlagFile => string.Join('/', AppDirName, "includeThreeJS.bool");

        public bool IncludeThreeJS => System.IO.File.Exists(ThreeJSFlagFile);
        public bool IncludeCSS => System.IO.File.Exists(StylePath);

        private static readonly Regex namePattern = new(@"\w+(?:-\w+)*", RegexOptions.Compiled);

        public bool HasTest { get; private set; }
        public IEnumerable<string> TestNames { get; private set; }

        public TestModel(YarrowContext db, IWebHostEnvironment env, ILogger<TestModel> logger)
            : base(db, "test", env, logger)
        { }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            HasTest = Name is not null
                && namePattern.IsMatch(Name)
                && System.IO.File.Exists(ScriptPath);

            if (!HasTest)
            {
                var dir = new DirectoryInfo(AppRoot);
                TestNames = from sub in dir.EnumerateDirectories()
                            where sub.Touch("index.js").Exists
                            orderby sub.Name
                            select sub.Name;
            }

            return Page();
        }
    }
}
