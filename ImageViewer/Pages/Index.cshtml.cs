using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace ImageViewer.Pages
{
    public class IndexModel : PageModel
    {
        private ILogger<IndexModel> logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            this.logger = logger;
        }

        public void OnGet()
        {
            logger.LogInformation("OK, I got it already");
        }
    }
}