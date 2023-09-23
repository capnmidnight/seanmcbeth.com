namespace Yarrow.Models
{
    public class DeleteOp
    {
        public int[] AudioTracks { get; set; }
        public int[][] Connections { get; set; }
        public int[] Models { get; set; }
        public int[] Signs { get; set; }
        public int[] Stations { get; set; }
        public int[] Transforms { get; set; }
        public int[] VideoClips { get; set; }
        public int[] Texts { get; set; }
    }
}
