using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<FileContent> FileContents { get; set; }
    }

    public partial class FileContent
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FileContent>(entity =>
            {
                entity.HasKey(e => e.FileId)
                    .HasName("FileContents_pkey");

                entity.HasIndex(e => e.FileId, "filecontents_fileid_index");

                entity.Property(e => e.FileId)
                    .ValueGeneratedNever()
                    .HasColumnName("FileID");

                entity.Property(e => e.Data).IsRequired();

                entity.HasOne(d => d.File)
                    .WithOne(p => p.FileContent)
                    .HasForeignKey<FileContent>(d => d.FileId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_FileContents_Files");
            });
        }

        public int FileId { get; set; }
        public byte[] Data { get; set; }

        public virtual File File { get; set; }
    }
}
