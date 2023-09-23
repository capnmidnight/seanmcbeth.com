namespace Yarrow.Models
{
    public class SignCreateInput
    {
        public int FileID { get; set; }
        public int ParentTransformID { get; set; }
        public int ImageWidth { get; set; }
        public int ImageHeight { get; set; }
    }
}
