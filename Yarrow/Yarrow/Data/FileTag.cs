using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<FileTag> FileTags { get; set; }
    }

    public partial class FileTag
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FileTag>(entity =>
            {
                entity.HasIndex(e => new { e.Id, e.Name }, "FileTags_ID_Name__IDX");

                entity.HasIndex(e => e.Name, "FileTags_Name_unq")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name).IsRequired();
            });
        }

        public FileTag()
        {
            Files = new HashSet<File>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<File> Files { get; set; }
    }
}
