namespace Yarrow.Models
{
    public class ReportVideoClip : AbstractValueReport<VideoClipOutput>
    {
        public override string Name => string.IsNullOrWhiteSpace(Value.Label)
            ? Value.FileName
            : Value.Label;

        public List<Visit> Views { get; } = new();

        public TimeSpan TotalViewDuration => Views.Sum(v => v.Duration);

        public List<Visit> Plays { get; } = new();

        public TimeSpan TotalPlayDuration => Plays.Sum(v => v.Duration);

        public ReportVideoClip(VideoClipOutput video)
            : base(video)
        {
        }

        public bool View(DateTime start, double duration)
        {
            Views.Start(start, start.AddSeconds(duration));
            return true;
        }

        public bool StartListen(DateTime start, DateTime end)
        {
            Plays.Start(start, end);
            return true;
        }

        public bool EndListen(DateTime end) =>
            Plays.End(end);
    }
}
