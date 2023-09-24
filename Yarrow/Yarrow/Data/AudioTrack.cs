// Ignore Spelling: Spatialize

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<AudioTrack> AudioTracks { get; set; }
    }

    [Index(nameof(Id), nameof(TransformId), nameof(FileId))]
    public partial class AudioTrack
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

        public required bool Spatialize { get; set; }

        public float Volume { get; set; } = 1f;

        public float MinDistance { get; set; } = 0;

        public float MaxDistance { get; set; } = float.MaxValue;

        public string Zone { get; set; } = "";

        public bool Enabled { get; set; } = true;

        public string Label { get; set; } = "";

        public string Effect { get; set; } = "";
    }
}
