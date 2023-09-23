using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<AudioTrack> AudioTracks { get; set; }
    }

    public partial class AudioTrack
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AudioTrack>(entity =>
            {
                entity.HasIndex(e => e.FileId, "AudioTracks_FileID_index");

                entity.HasIndex(e => e.TransformId, "AudioTracks_TransformID_index");

                entity.Property(e => e.Id)
                    .HasColumnName("ID");

                entity.Property(e => e.Enabled)
                    .IsRequired()
                    .HasDefaultValueSql("true");

                entity.Property(e => e.FileId)
                    .HasColumnName("FileID");

                entity.Property(e => e.Label)
                    .IsRequired()
                    .HasDefaultValueSql("''::text");

                entity.Property(e => e.TransformId)
                    .HasColumnName("TransformID");

                entity.Property(e => e.Zone)
                    .IsRequired()
                    .HasDefaultValueSql("''::text");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.AudioTracks)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_AudioTracks_Files");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.AudioTracks)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_AudioTracks_Transforms");
            });
        }

        public int Id { get; set; }
        public int TransformId { get; set; }
        public int FileId { get; set; }
        public float Volume { get; set; }
        public float MinDistance { get; set; }
        public float MaxDistance { get; set; }
        public bool Spatialize { get; set; }
        public string Zone { get; set; }
        public bool? Enabled { get; set; }
        public string Label { get; set; }
        public string Effect { get; set; }

        public virtual File File { get; set; }
        public virtual Transform Transform { get; set; }
    }
}
