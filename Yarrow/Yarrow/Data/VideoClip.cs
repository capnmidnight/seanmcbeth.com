using Juniper.Data;

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

using static Juniper.XR.SphereEncoding;
using static Juniper.XR.StereoLayout;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<VideoClip> VideoClips { get; set; }
    }

    public partial class VideoClip
    {
        public int Id { get; set; }

        [ForeignKey(nameof(Transform))]
        public int TransformId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Transform? Transform { get; set; }

        [ForeignKey(nameof(File))]
        public int FileId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public File? File { get; set; }

        public float Volume { get; set; }

        [DefaultValueSql("true")]
        public bool Enabled { get; set; }

        [DefaultValueSql("''")]
        public string Label { get; set; } = "";

        public SphereEncodingKind SphereEncoding { get; set; }
        public StereoLayoutKind StereoLayout { get; set; }
    }
}
