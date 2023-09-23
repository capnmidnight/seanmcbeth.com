using System.ComponentModel.DataAnnotations;

namespace Yarrow.Models
{
    public class FileUploadInput
    {
        [Display(Name = "File")]
        public IFormFile FormFile { get; set; }
        public string Copyright { get; set; }
        public DateTime? CopyrightDate { get; set; }
    }
}
