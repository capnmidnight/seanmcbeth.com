using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Yarrow.Pages
{
    public class StatusModel : PageModel
    {
        [FromRoute]
        public int Code { get; set; }

        public IActionResult OnGet()
        {
            var response = Page();
            response.StatusCode = Code;
            return response;
        }
    }
}
