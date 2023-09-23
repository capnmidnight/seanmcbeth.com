using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<HeadsetLocation> HeadsetLocations { get; set; }
    }

    public partial class HeadsetLocation
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HeadsetLocation>(entity =>
            {
                entity.HasIndex(e => e.HeadsetId, "IX_HeadsetLocations_HeadsetID");

                entity.Property(e => e.Id)
                    .HasColumnName("ID");

                entity.Property(e => e.Description)
                    .IsRequired();

                entity.Property(e => e.HeadsetId)
                    .HasColumnName("HeadsetID");

                entity.Property(e => e.StartDate)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(d => d.Headset)
                    .WithMany(p => p.HeadsetLocations)
                    .HasForeignKey(d => d.HeadsetId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_HeadsetLocations_to_Headsets");
            });
        }

        public int Id { get; set; }
        public int HeadsetId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string Description { get; set; }

        public virtual Headset Headset { get; set; }
    }
}
