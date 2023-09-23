using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Organization> Organizations { get; set; }
    }

    public partial class Organization
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Organization>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");
            });
        }

        public Organization()
        {
            Users = new HashSet<UserProfile>();
            ScenarioGroups = new HashSet<ScenarioGroup>();
            MenuItems = new HashSet<MenuItem>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Timestamp { get; set; }

        public virtual ICollection<UserProfile> Users { get; set; }
        public virtual ICollection<ScenarioGroup> ScenarioGroups { get; set; }
        public virtual ICollection<MenuItem> MenuItems { get; set; }
    }
}
