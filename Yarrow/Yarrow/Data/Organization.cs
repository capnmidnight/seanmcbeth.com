using Juniper.Data;

using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Organization> Organizations { get; set; }
    }

    public partial class Organization
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        [DefaultValueSql("CURRENT_TIMESTAMP")]
        public DateTime CreatedOn { get; set; }

        public ICollection<UserProfile> Users { get; set; } = new HashSet<UserProfile>();
        public ICollection<Scenario> ScenarioGroups { get; set; } = new HashSet<Scenario>();
        public ICollection<MenuItem> MenuItems { get; set; } = new HashSet<MenuItem>();
    }
}
