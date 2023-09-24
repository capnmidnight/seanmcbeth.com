using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<FileContent> FileContents { get; set; }
    }

    public partial class FileContent
    {
        [Key]
        [ForeignKey(nameof(File))]
        public int FileId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public File? File { get; set; }

        public byte[] Data { get; set; }
    }
}
