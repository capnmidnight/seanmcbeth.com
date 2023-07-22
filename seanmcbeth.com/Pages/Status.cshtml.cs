using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SeanMcBeth.Pages
{
    public class StatusModel : PageModel
    {
        [FromRoute]
        public int Code { get; set; }
    }
}
