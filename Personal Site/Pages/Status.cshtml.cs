using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Yarrow.Pages
{
    public class StatusModel : PageModel
    {
        [FromRoute]
        public int Code { get; set; }
    }
}
