using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Report> Reports { get; set; }
    }

    public partial class Report
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .IsRequired(false);

                entity.Property(e => e.Timestamp)
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Reports)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => new { e.Id, e.UserId, e.Timestamp });
            });
        }

        public Report()
        {
            Logs = new HashSet<Log>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime Timestamp { get; set; }

        public virtual UserProfile User { get; set; }
        public virtual IEnumerable<Log> Logs { get; set; }
    }
}
