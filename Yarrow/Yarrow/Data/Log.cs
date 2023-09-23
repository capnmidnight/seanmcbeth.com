using Microsoft.EntityFrameworkCore;

using System.Net;
using System.Text.Json;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Log> Logs { get; set; }
    }

    public partial class Log : IDisposable
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Log>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .IsRequired(false);

                entity.Property(e => e.Timestamp)
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(d => d.Key)
                    .IsRequired();

                entity.Property(d => d.Value);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Report)
                    .WithMany(p => p.Logs)
                    .HasForeignKey(d => d.ReportId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.ReportId);
                entity.HasIndex(e => new { e.Id, e.UserId, e.Timestamp, e.FromAddress, e.Key, e.Value });
            });
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public int? ReportId { get; set; }
        public DateTime Timestamp { get; set; }
        public IPAddress FromAddress { get; set; }
        public string Key { get; set; }
        public JsonDocument Value { get; set; }

        public virtual UserProfile User { get; set; }
        public virtual Report Report { get; set; }

        private bool disposedValue;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    Value?.Dispose();
                }

                disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
