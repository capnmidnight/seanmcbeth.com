using Microsoft.AspNetCore.Mvc;

namespace Yarrow.Models
{
    public class HeadsetUpdateInput : HeadsetCreateInput
    {
        [BindProperty]
        public string Notes { get; set; }
    }
}
