using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<MenuItem> MenuItems { get; set; }
    }

    public partial class MenuItem
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Parent))]
        public int? ParentId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public MenuItem? Parent { get; set; }

        [ForeignKey(nameof(File))]
        public int? FileId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public File? File { get; set; }

        [ForeignKey(nameof(ScenarioGroup))]
        public int? ScenarioGroupId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Scenario? ScenarioGroup { get; set; }

        [ForeignKey(nameof(Organization))]
        public int OrganizationId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Organization? Organization { get; set; }

        public int Order { get; set; }

        public string Label { get; set; }

        public ICollection<MenuItem> InverseParent { get; set; } = new HashSet<MenuItem>();
    }
}
