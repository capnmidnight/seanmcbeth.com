// Ignore Spelling: Grabbable

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Model> Models { get; set; }
    }

    public partial class Model
    {
        public int Id { get; set; }

        [ForeignKey(nameof(File))]
        public int FileId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public File? File { get; set; }

        [ForeignKey(nameof(Transform))]
        public int TransformId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Transform? Transform { get; set; }

        public bool IsGrabbable { get; set; }
    }
}
