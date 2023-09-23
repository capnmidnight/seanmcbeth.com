using System.Text.Json;

namespace Yarrow.Models
{
    public class LogInput
    {
        public int? ReportID { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
    }
}
