using Juniper;

namespace Yarrow.Models
{
    public class ReportText : AbstractValueReport<TextOutput>
    {
        public override string Name => Value.FileName;

        public List<Visit> Views { get; } = new();

        public TimeSpan TotalViewDuration => Views.Sum(v => v.Duration);

        public int ExpandCount { get; private set; } = 0;

        public bool IsCallout => Value.IsCallout;

        public ReportText(TextOutput text)
            : base(text)
        {
        }

        public bool View(DateTime start, double duration)
        {
            Views.Start(start, start.AddSeconds(duration));
            return true;
        }

        public bool ExpandText()
        {
            ++ExpandCount;
            return true;
        }
    }
}
