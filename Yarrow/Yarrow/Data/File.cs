// Ignore Spelling: Metadatum Gsv

using Juniper.Data;

using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<File> Files { get; set; }
    }

    public partial class File
    {
        public static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<File>(entity =>
            {
                entity.HasManyToMany(
                    d => d.Tags,
                    p => p.Files,
                    "TagOnFile",
                    "TagId",
                    "FileId"
                );
            });
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Mime { get; set; }
        public int Size { get; set; }
        public string Copyright { get; set; }
        public DateOnly CopyrightDate { get; set; }
        public string? AltMime { get; set; } = null;
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        public FileContent? FileContent { get; set; }

        public GsvMetadatum? GsvMetadatum { get; set; }

        public ICollection<AudioTrack> AudioTracks { get; set; } = new HashSet<AudioTrack>();
        public ICollection<MenuItem> MenuItems { get; set; } = new HashSet<MenuItem>();
        public ICollection<Model> Models { get; set; } = new HashSet<Model>();
        public ICollection<Sign> Signs { get; set; } = new HashSet<Sign>();
        public ICollection<Station> Stations { get; set; } = new HashSet<Station>();
        public ICollection<VideoClip> VideoClips { get; set; } = new HashSet<VideoClip>();
        public ICollection<Text> Texts { get; set; } = new HashSet<Text>();
        public ICollection<FileTag> Tags { get; set; } = new HashSet<FileTag>();
    }
}
