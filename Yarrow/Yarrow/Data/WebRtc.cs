using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<WebRtc> WebRtcs { get; set; }
    }

    public partial class WebRtc
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WebRtc>(entity =>
            {
                entity.ToTable("WebRTC");

                entity.Property(e => e.Enabled)
                    .IsRequired()
                    .HasDefaultValueSql("true");

                entity.Property(e => e.Host).IsRequired();

                entity.Property(e => e.Protocol).IsRequired();
            });
        }

        public int Id { get; set; }
        public string Protocol { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public bool? Enabled { get; set; }
    }
}
