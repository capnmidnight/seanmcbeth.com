using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Station> Stations { get; set; }
    }

    public partial class Station
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Station>(entity =>
            {
                entity.HasKey(e => e.TransformId)
                    .HasName("Stations_pkey");

                entity.HasIndex(e => e.TransformId, "fki_Stations_Transforms");

                entity.HasIndex(e => e.FileId, "stations_fileid_index");

                entity.Property(e => e.TransformId)
                    .ValueGeneratedNever()
                    .HasColumnName("TransformID");

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.Rotation).IsRequired();

                entity.Property(e => e.Zone)
                    .IsRequired()
                    .HasDefaultValueSql("''::text");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.Stations)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Stations_Files");

                entity.HasOne(d => d.Transform)
                    .WithOne(p => p.Station)
                    .HasForeignKey<Station>(d => d.TransformId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Stations_Transforms");

                entity.Ignore(e => e.Rotation);
            });
        }

        public Station()
        {
            Scenarios = new HashSet<Scenario>();
            StationConnectionFromStations = new HashSet<StationConnection>();
            StationConnectionToStations = new HashSet<StationConnection>();
        }

        public int TransformId { get; set; }
        public int FileId { get; set; }
        public string RotationString { get; set; }

        private float[] rotation;
        [NotMapped]
        public float[] Rotation
        {
            get => rotation ??= RotationString.Split(',').Select(float.Parse).ToArray();
            set => RotationString = (rotation = value).Select(v => v.ToString()).ToArray().Join(",");
        }

        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public float Altitude { get; set; }
        public string Zone { get; set; }
        public string Label { get; set; }

        public virtual File File { get; set; }
        public virtual Transform Transform { get; set; }
        public virtual ICollection<Scenario> Scenarios { get; set; }
        public virtual ICollection<StationConnection> StationConnectionFromStations { get; set; }
        public virtual ICollection<StationConnection> StationConnectionToStations { get; set; }
    }
}
