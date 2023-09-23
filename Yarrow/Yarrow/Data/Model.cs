using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Model> Models { get; set; }
    }

    public partial class Model
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Model>(entity =>
            {
                entity.HasIndex(e => e.FileId, "Models_FileID_index");

                entity.HasIndex(e => e.TransformId, "Models_TransformID_index");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.TransformId).HasColumnName("TransformID");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.Models)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Models_Files");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.Models)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Models_Transforms");
            });
        }

        public int Id { get; set; }
        public int FileId { get; set; }
        public int TransformId { get; set; }
        public bool IsGrabbable { get; set; }

        public virtual File File { get; set; }
        public virtual Transform Transform { get; set; }
    }
}
