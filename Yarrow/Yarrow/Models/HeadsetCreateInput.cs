using Microsoft.AspNetCore.Mvc;

namespace Yarrow.Models
{
    public class HeadsetCreateInput
    {
        [BindProperty]
        public string HeadsetName { get; set; }

        [BindProperty]
        public string HeadsetSN { get; set; }

        [BindProperty]
        public string HeadsetModel { get; set; }

        [BindProperty]
        public string HeadsetLocation { get; set; }

        [BindProperty]
        public DateTime? PurchaseDate { get; set; }

        [BindProperty]
        public float? PurchasePrice { get; set; }
    }
}
