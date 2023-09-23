using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<StationConnection> StationConnections { get; set; }
    }

    public partial class StationConnection
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StationConnection>(entity =>
            {
                entity.HasKey(e => new { e.FromStationId, e.ToStationId })
                    .HasName("StationConnections_pkey");

                entity.HasIndex(e => e.FromStationId, "StationConnections_FromStationID_index");

                entity.HasIndex(e => e.ToStationId, "StationConnections_ToStationID_index");

                entity.HasIndex(e => e.TransformId, "StationConnections_TransformID_index");

                entity.Property(e => e.FromStationId).HasColumnName("FromStationID");

                entity.Property(e => e.ToStationId).HasColumnName("ToStationID");

                entity.Property(e => e.TransformId).HasColumnName("TransformID");

                entity.HasOne(d => d.FromStation)
                    .WithMany(p => p.StationConnectionFromStations)
                    .HasForeignKey(d => d.FromStationId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_StationConnection_From");

                entity.HasOne(d => d.ToStation)
                    .WithMany(p => p.StationConnectionToStations)
                    .HasForeignKey(d => d.ToStationId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_StationConnection_To");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.StationConnections)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_StationConnection_Transform");
            });
        }

        public int? TransformId { get; set; }
        public int FromStationId { get; set; }
        public int ToStationId { get; set; }
        public string Label { get; set; }

        public virtual Transform Transform { get; set; }
        public virtual Station FromStation { get; set; }
        public virtual Station ToStation { get; set; }
    }
}
