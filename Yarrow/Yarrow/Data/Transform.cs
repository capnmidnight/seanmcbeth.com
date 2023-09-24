using Juniper.Data;

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Transform> Transforms { get; set; }
    }

    public partial class Transform
    {
        public int Id { get; set; }
        public string Name { get; set; }

        [DefaultValueSql("'1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1'")]
        public string MatrixString { get; set; }
        private float[]? matrix;

        [NotMapped]
        public float[] Matrix
        {
            get => matrix ??= MatrixString.Split(',').Select(float.Parse).ToArray();
            set => MatrixString = (matrix = value).Select(v => v.ToString()).ToArray().Join(",");
        }

        [ForeignKey(nameof(ParentTransform))]
        public int? ParentTransformId { get; set; }

        [ForeignKey(nameof(Scenario))]
        public int ScenarioId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Transform? ParentTransform { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public ScenarioSnapshot? Scenario { get; set; }

        public Station? Station { get; set; }

        public ICollection<AudioTrack> AudioTracks { get; set; } = new HashSet<AudioTrack>();
        public ICollection<Transform> InverseParentTransform { get; set; } = new HashSet<Transform>();
        public ICollection<Model> Models { get; set; } = new HashSet<Model>();
        public ICollection<Sign> Signs { get; set; } = new HashSet<Sign>();
        public ICollection<StationConnection> StationConnections { get; set; } = new HashSet<StationConnection>();
        public ICollection<VideoClip> VideoClips { get; set; } = new HashSet<VideoClip>();
        public ICollection<Text> Texts { get; set; } = new HashSet<Text>(); 
    }
}
