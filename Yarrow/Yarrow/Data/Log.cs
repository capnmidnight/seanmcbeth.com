using Juniper.Data;

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;
using System.Net;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Log> Logs { get; set; }
    }

    public partial class Log
    {
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public string UserId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public UserProfile? User { get; set; }

        [ForeignKey(nameof(Report))]
        public int? ReportId { get; set; }

        [DeleteBehavior(DeleteBehavior.SetNull)]
        public Report? Report { get; set; }

        [DefaultValueSql("CURRENT_TIMESTAMP")]
        public DateTime CreatedOn { get; set; }
        public required IPAddress FromAddress { get; set; }
        public required string Key { get; set; }
        public required string Value { get; set; }
    }
}
