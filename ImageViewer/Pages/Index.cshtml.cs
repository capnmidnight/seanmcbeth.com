using Juniper.AppShell;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ImageViewer.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IAppShell appShell;

        public IndexModel(ILogger<IndexModel> logger, IAppShell appShell)
        {
            _logger = logger;
            this.appShell = appShell;
        }

        public async Task OnGetAsync()
        {
            await appShell.SetTitleAsync("Image Viewer - Home");
        }
    }
}