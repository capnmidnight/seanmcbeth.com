namespace Yarrow.Models
{
    public class PhotosphereInput : FileInput
    {
        public string Pano { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public string Copyright { get; set; }
        public DateTime? Date { get; set; }
    }
}
