using Juniper;

namespace Yarrow.Models
{
    public class ReportSign : AbstractValueReport<SignOutput>
    {
        public override string Name => Value.FileName;

        public List<Visit> Views { get; } = new();

        public TimeSpan TotalViewDuration => Views.Sum(v => v.Duration);

        public int ExpandCount { get; private set; } = 0;

        public HashSet<int> PagesLoaded { get; } = new HashSet<int>();

        public bool IsCallout => Value.IsCallout;

        public bool IsPDF => Value.MediaType == MediaType.Application_Pdf;

        public ReportSign(SignOutput sign)
            : base(sign)
        {
        }

        public bool View(DateTime start, double duration)
        {
            Views.Start(start, start.AddSeconds(duration));
            return true;
        }

        public bool ExpandSign()
        {
            ++ExpandCount;
            return true;
        }

        public bool LoadPage(int page)
        {
            PagesLoaded.Add(page);
            return true;
        }
    }
}
