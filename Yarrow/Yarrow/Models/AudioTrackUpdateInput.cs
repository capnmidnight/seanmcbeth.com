namespace Yarrow.Models
{
    public class AudioTrackUpdateInput
    {
        public int ID { get; set; }
        public bool Enabled { get; set; }
        public string Label { get; set; }
        public float MinDistance { get; set; }
        public float MaxDistance { get; set; }
        public float Volume { get; set; }
        public string Zone { get; set; }
        public string Effect { get; set; }
        public string FileName { get; set; }
    }
}
