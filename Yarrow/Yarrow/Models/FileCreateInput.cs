namespace Yarrow.Models
{
    public class FileInput
    {
        public IFormFile FormFile { get; set; }
    }

    public class FileCreateInput : FileInput
    {
        public string AltContentType { get; set; }
        public string TagString { get; set; }
        public string Copyright { get; set; }
        public DateTime? CopyrightDate { get; set; }
    }
}
