using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<FileTag> FileTags { get; set; }
    }

    public partial class FileTag
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        public ICollection<File> Files { get; set; } = new HashSet<File>();
    }
}
