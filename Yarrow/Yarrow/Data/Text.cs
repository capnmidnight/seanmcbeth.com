using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Text> Texts { get; set; }
    }

    public partial class Text
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Text>(entity =>
            {
                entity.HasIndex(e => e.FileId, "Texts_FileID_index");

                entity.HasIndex(e => e.TransformId, "Texts_TransformID_index");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.TransformId).HasColumnName("TransformID");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.Texts)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Texts_Files");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.Texts)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Texts_Transforms");
            });
        }

        public int Id { get; set; }
        public int FileId { get; set; }
        public int TransformId { get; set; }
        public bool IsCallout { get; set; }
        public bool AlwaysVisible { get; set; }

        public virtual File File { get; set; }
        public virtual Transform Transform { get; set; }
    }
}
