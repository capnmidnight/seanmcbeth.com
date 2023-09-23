using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Language> Languages { get; set; }
    }

    public partial class Language
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Language>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name).IsRequired();
            });
        }

        public Language()
        {
            ScenarioGroups = new HashSet<ScenarioGroup>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<ScenarioGroup> ScenarioGroups { get; set; }
    }
}
