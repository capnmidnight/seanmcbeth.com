using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Headset> Headsets { get; set; }
    }

    public partial class Headset
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Headset>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Model).IsRequired();

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Notes).HasDefaultValueSql("''::text");

                entity.Property(e => e.SerialNumber)
                    .IsRequired()
                    .HasDefaultValueSql("''::text");
            });
        }

        public Headset()
        {
            HeadsetLocations = new HashSet<HeadsetLocation>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string SerialNumber { get; set; }
        public string Model { get; set; }
        public DateOnly? PurchaseDate { get; set; }
        public int? PurchasePrice { get; set; }
        public string Notes { get; set; }

        public virtual ICollection<HeadsetLocation> HeadsetLocations { get; set; }
    }
}
