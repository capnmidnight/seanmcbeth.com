namespace Yarrow.Models
{
    public class ReportModel : AbstractValueReport<ModelOutput>
    {
        public override string Name => Value.FileName;

        public List<Visit> Views { get; } = new();
        public TimeSpan TotalViewDuration => Views.Sum(x => x.Duration);

        public ReportModel(ModelOutput model)
            : base(model)
        {
        }

        public bool View(DateTime start, double duration)
        {
            Views.Start(start, start.AddSeconds(duration));
            return true;
        }
    }
}
