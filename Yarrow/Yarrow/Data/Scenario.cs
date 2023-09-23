using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Scenario> Scenarios { get; set; }
    }

    public partial class Scenario
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Scenario>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .HasDefaultValueSql("nextval('\"Activities_ID_seq\"'::regclass)");

                entity.Property(e => e.Version).HasDefaultValue(1);
                entity.Property(e => e.Published).HasDefaultValue(false);

                entity.Property(e => e.StartStationId).HasColumnName("StartStationID");

                entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.CreatedScenarios)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Scenarios_CreatedBy");

                entity.HasIndex(e => e.CreatedById, "IX_Scenarios_CreatedByID");
                entity.HasIndex(e => new { e.Id, e.CreatedById }, "fki_FK_Scenario_CreatedBy");

                entity.HasOne(d => d.PublishedBy)
                    .WithMany(p => p.PublishedScenarios)
                    .HasForeignKey(d => d.PublishedById)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Scenarios_PublishedBy");

                entity.HasIndex(e => e.PublishedById, "IX_Scenarios_PublishedByID");
                entity.HasIndex(e => new { e.Id, e.PublishedById }, "fki_FK_Scenario_PublishedBy");

                entity.HasOne(d => d.ScenarioGroup)
                    .WithMany(p => p.Scenarios)
                    .HasForeignKey(d => d.ScenarioGroupId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Scenario_ScenarioGroup");

                entity.HasIndex(e => e.ScenarioGroupId, "IX_Scenarios_ScenarioGroupID");
                entity.HasIndex(e => new { e.Id, e.ScenarioGroupId }, "fki_FK_Scenario_ScenarioGroup");

                entity.HasOne(d => d.StartStation)
                    .WithMany(p => p.Scenarios)
                    .HasForeignKey(d => d.StartStationId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_Scenario_StartStation");

                entity.HasIndex(e => e.StartStationId, "IX_Scenario_StartStationID");
                entity.HasIndex(e => new { e.Id, e.StartStationId }, "fki_FK_Scenario_StartStation");
            });
        }

        public Scenario()
        {
            Transforms = new HashSet<Transform>();
        }

        public int Id { get; set; }
        public DateTime Timestamp { get; set; }
        public string CreatedById { get; set; }
        public int ScenarioGroupId { get; set; }
        public int Version { get; set; }
        public bool Published { get; set; }
        public DateTime? PublishedOn { get; set; }
        public string PublishedById { get; set; }
        public int? StartStationId { get; set; }
        public float StartRotation { get; set; }
        public float? OriginAltitude { get; set; }
        public float? OriginLatitude { get; set; }
        public float? OriginLongitude { get; set; }

        public virtual ScenarioGroup ScenarioGroup { get; set; }
        public virtual Station StartStation { get; set; }
        public virtual UserProfile CreatedBy { get; set; }
        public virtual UserProfile PublishedBy { get; set; }
        public virtual ICollection<Transform> Transforms { get; set; }
    }
}
