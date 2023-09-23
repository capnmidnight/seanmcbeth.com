namespace Yarrow.Models
{
    public class StationUpdateInput
    {
        public int StationID { get; set; }
        public string FileName { get; set; }
        public string Zone { get; set; }
        public string Label { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public float Altitude { get; set; }
        public float[] Rotation { get; set; }
    }
}
