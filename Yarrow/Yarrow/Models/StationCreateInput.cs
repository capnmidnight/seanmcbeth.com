namespace Yarrow.Models
{
    public class StationCreateInput
    {
        public int TransformID { get; set; }
        public int FileID { get; set; }
        public float[] Matrix { get; set; }
        public float[] Rotation { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public float Altitude { get; set; }
        public string Zone { get; set; }
    }
}
