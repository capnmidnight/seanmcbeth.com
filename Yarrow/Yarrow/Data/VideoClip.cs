using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

using static Juniper.XR.SphereEncoding;
using static Juniper.XR.StereoLayout;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<VideoClip> VideoClips { get; set; }
    }

    public partial class VideoClip
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VideoClip>(entity =>
            {
                entity.HasIndex(e => e.FileId, "VideoClips_FileID_index");

                entity.HasIndex(e => e.TransformId, "VideoClips_TransformID_index");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Enabled)
                    .IsRequired()
                    .HasDefaultValueSql("true");

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.Label)
                    .IsRequired()
                    .HasDefaultValueSql("''::text");

                entity.Property(e => e.SphereEncoding)
                    .IsRequired()
                    .HasConversion<EnumToStringConverter<SphereEncodingKind>>();

                entity.Property(e => e.StereoLayout)
                    .IsRequired()
                    .HasConversion<EnumToStringConverter<StereoLayoutKind>>();

                entity.Property(e => e.TransformId).HasColumnName("TransformID");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.VideoClips)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_VideoClips_Files");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.VideoClips)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_VideoClips_Transforms");
            });
        }

        public int Id { get; set; }
        public int TransformId { get; set; }
        public int FileId { get; set; }
        public float Volume { get; set; }
        public bool? Enabled { get; set; }
        public string Label { get; set; }
        public SphereEncodingKind SphereEncoding { get; set; }
        public StereoLayoutKind StereoLayout { get; set; }

        public virtual File File { get; set; }
        public virtual Transform Transform { get; set; }
    }
}
