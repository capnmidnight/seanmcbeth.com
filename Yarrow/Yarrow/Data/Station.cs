using Juniper.Data;

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Station> Stations { get; set; }
    }

    public partial class Station
    {
        [Key]
        [ForeignKey(nameof(Transform))]
        public int TransformId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Transform? Transform { get; set; }

        [ForeignKey(nameof(File))]
        public int FileId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public File? File { get; set; }

        [DefaultValueSql("'1,0,0,0'")]
        public string RotationString { get; set; }

        private float[]? rotation;
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

        public ICollection<ScenarioSnapshot> Scenarios { get; set; } = new HashSet<ScenarioSnapshot>();

        [InverseProperty(nameof(StationConnection.FromStation))]
        public ICollection<StationConnection> StationConnectionFromStations { get; set; } = new HashSet<StationConnection>();

        [InverseProperty(nameof(StationConnection.ToStation))]
        public ICollection<StationConnection> StationConnectionToStations { get; set; } = new HashSet<StationConnection>();
    }
}
