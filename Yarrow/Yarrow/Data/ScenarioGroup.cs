using Juniper.Data;

using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<ScenarioGroup> ScenarioGroups { get; set; }
    }

    public partial class ScenarioGroup
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ScenarioGroup>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.LanguageId);

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");

                entity.HasOne(d => d.Language)
                    .WithMany(p => p.ScenarioGroups)
                    .HasForeignKey(d => d.LanguageId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_ScenarioGroup_Language");

                entity.HasIndex(e => e.LanguageId, "IX_ScenarioGroups_LanguageID");
                entity.HasIndex(e => new { e.Id, e.LanguageId }, "fki_FK_ScenarioGroup_Language");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ScenarioGroups)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_ScenarioGroup_CreatedBy");

                entity.HasIndex(e => e.CreatedById, "IX_ScenarioGroups_CreatedByID");
                entity.HasIndex(e => new { e.Id, e.CreatedById }, "fki_FK_ScenarioGroup_CreatedBy");

                entity.HasManyToMany(
                    left => left.Organizations,
                    right => right.ScenarioGroups,
                    "ScenarioGroupsGrantedToOrganizations",
                    "ScenarioGroupId",
                    "OrganizationId");
            });
        }

        public ScenarioGroup()
        {
            MenuItems = new HashSet<MenuItem>();
            Scenarios = new HashSet<Scenario>();
            Organizations = new HashSet<Organization>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Timestamp { get; set; }
        public string CreatedById { get; set; }
        public int LanguageId { get; set; }
        public virtual Language Language { get; set; }
        public virtual UserProfile CreatedBy { get; set; }
        public virtual ICollection<MenuItem> MenuItems { get; set; }
        public virtual ICollection<Scenario> Scenarios { get; set; }
        public virtual ICollection<Organization> Organizations { get; set; }
    }
}
