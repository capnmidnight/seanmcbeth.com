using Juniper.Data;

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Report> Reports { get; set; }
    }

    public partial class Report
    {
        public int Id { get; set; }

        [ForeignKey(nameof(User))]
        public required string UserId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public UserProfile? User { get; set; }

        [DefaultValueSql("CURRENT_TIMESTAMP")]
        public DateTime CreatedOn { get; set; }

        public IEnumerable<Log> Logs { get; set; } = new HashSet<Log>();
    }
}
