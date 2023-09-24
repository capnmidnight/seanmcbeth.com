using Juniper.Data;

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Scenario> Scenarios { get; set; }
    }

    public partial class Scenario
    {
        public int Id { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public string CreatedById { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public UserProfile? CreatedBy { get; set; }

        public string Name { get; set; }

        [DefaultValueSql("CURRENT_TIMESTAMP")]
        public DateTime CreatedOn { get; set; }

        public ICollection<MenuItem> MenuItems { get; set; } = new HashSet<MenuItem>();
        public ICollection<ScenarioSnapshot> Scenarios { get; set; } = new HashSet<ScenarioSnapshot>();
        public ICollection<Organization> Organizations { get; set; } = new HashSet<Organization>();
    }
}
