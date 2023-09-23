namespace Yarrow.Models
{
    public class Visit : IComparable<Visit>
    {
        public DateTime Start { get; }
        public DateTime End { get; set; }
        public TimeSpan Duration => End - Start;

        public Visit(Data.Report report)
            : this(
                  report?.Logs?.MaybeMin(l => l.Timestamp) ?? DateTime.MinValue,
                  report?.Logs?.MaybeMax(l => l.Timestamp) ?? DateTime.MaxValue)
        {

        }

        public Visit(DateTime start, DateTime end)
        {
            Start = start;
            End = end;
        }

        public int CompareTo(Visit other)
        {
            return Start.CompareTo(other.Start);
        }
    }

    public static class VisitListExt
    {
        public static void Start(this List<Visit> visits, DateTime start, DateTime end)
        {
            visits.InsertSorted(new Visit(start, end));
        }

        public static bool End(this List<Visit> visits, DateTime end)
        {
            int index = 0;
            while (index < visits.Count - 1
                && visits[index + 1].Start < end)
            {
                ++index;
            }

            if (0 <= index && index < visits.Count)
            {
                visits[index].End = end;
                return true;
            }

            return false;
        }
    }
}
