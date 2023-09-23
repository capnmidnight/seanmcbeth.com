using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Gsvmetadatum> Gsvmetadata { get; set; }
    }

    public partial class Gsvmetadatum
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Gsvmetadatum>(entity =>
            {
                entity.HasKey(e => e.FileId)
                    .HasName("GSVMetadata_pkey");

                entity.ToTable("GSVMetadata");

                entity.HasIndex(e => e.Pano, "GSVMetadata_unique_pano")
                    .IsUnique();

                entity.HasIndex(e => e.FileId, "fki_Metadata_Files");

                entity.Property(e => e.FileId)
                    .ValueGeneratedNever()
                    .HasColumnName("FileID");

                entity.Property(e => e.Pano).IsRequired();

                entity.HasOne(d => d.File)
                    .WithOne(p => p.Gsvmetadatum)
                    .HasForeignKey<Gsvmetadatum>(d => d.FileId)
                    .HasConstraintName("fk_Metadata_Files");
            });
        }

        public int FileId { get; set; }
        public string Pano { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }

        public virtual File File { get; set; }
    }
}
