using Juniper.Configuration;

using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SeanMcBeth.Pages
{
    public class IndexModel : PageModel
    {
        public Version? SiteVersion { get; private set; }

        public IndexModel(IConfiguration config)
        {
            SiteVersion = config.GetVersion();
        }

        public void OnGet()
        {

        }
    }
}
