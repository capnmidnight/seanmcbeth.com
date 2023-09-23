namespace Yarrow.Models
{
    public class ReportAudioTrack : AbstractValueReport<AudioTrackOutput>
    {
        public override string Name => string.IsNullOrWhiteSpace(Value.Label)
            ? Value.FileName
            : Value.Label;

        public List<Visit> Listens { get; } = new();

        public int TimesListened => Listens.Count;
        public TimeSpan TotalListenDuration => Listens.Sum(l => l.Duration);

        public ReportAudioTrack(AudioTrackOutput audio)
            : base(audio)
        {
        }

        public bool StartListen(DateTime start, DateTime end)
        {
            Listens.Start(start, end);
            return true;
        }

        public bool EndListen(DateTime end) =>
            Listens.End(end);
    }
}
