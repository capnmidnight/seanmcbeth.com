namespace Yarrow.Models
{
    public class AudioTrackCreateInput
    {
        public int FileID { get; set; }
        public int ParentTransformID { get; set; }
        public bool Spatialize { get; set; }
    }
}
