using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Transform> Transforms { get; set; }
    }

    public partial class Transform
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transform>(entity =>
            {
                entity.HasIndex(e => e.ScenarioId, "fki_FK_Transform_Scenario");

                entity.HasIndex(e => e.ParentTransformId, "fki_FK_Transforms_ParentTransforms");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Matrix)
                    .IsRequired()
                    .HasDefaultValueSql("'1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1'");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.ParentTransformId).HasColumnName("ParentTransformID");

                entity.Property(e => e.ScenarioId).HasColumnName("ScenarioID");

                entity.HasOne(d => d.ParentTransform)
                    .WithMany(p => p.InverseParentTransform)
                    .HasForeignKey(d => d.ParentTransformId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Transforms_ParentTransforms");

                entity.HasOne(d => d.Scenario)
                    .WithMany(p => p.Transforms)
                    .HasForeignKey(d => d.ScenarioId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Transform_Scenario");

                entity.Ignore(e => e.Matrix);
            });
        }

        public Transform()
        {
            AudioTracks = new HashSet<AudioTrack>();
            InverseParentTransform = new HashSet<Transform>();
            Models = new HashSet<Model>();
            Signs = new HashSet<Sign>();
            StationConnections = new HashSet<StationConnection>();
            VideoClips = new HashSet<VideoClip>();
            Texts = new HashSet<Text>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string MatrixString { get; set; }
        private float[] matrix;
        public float[] Matrix
        {
            get => matrix ??= MatrixString.Split(',').Select(float.Parse).ToArray();
            set => MatrixString = (matrix = value).Select(v => v.ToString()).ToArray().Join(",");
        }
        public int? ParentTransformId { get; set; }
        public int ScenarioId { get; set; }

        public virtual Transform ParentTransform { get; set; }
        public virtual Scenario Scenario { get; set; }
        public virtual Station Station { get; set; }
        public virtual ICollection<AudioTrack> AudioTracks { get; set; }
        public virtual ICollection<Transform> InverseParentTransform { get; set; }
        public virtual ICollection<Model> Models { get; set; }
        public virtual ICollection<Sign> Signs { get; set; }
        public virtual ICollection<StationConnection> StationConnections { get; set; }
        public virtual ICollection<VideoClip> VideoClips { get; set; }
        public virtual ICollection<Text> Texts { get; set; }
    }
}
