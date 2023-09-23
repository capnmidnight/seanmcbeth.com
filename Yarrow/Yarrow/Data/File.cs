using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<File> Files { get; set; }
    }

    public partial class File
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<File>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("ID");

                entity.Property(e => e.AltMime)
                    .HasColumnName("AltMIME");

                entity.Property(e => e.Copyright)
                    .HasDefaultValueSql("''::text");

                entity.Property(e => e.Mime)
                    .IsRequired()
                    .HasColumnName("MIME");

                entity.Property(e => e.Name)
                    .IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasDefaultValueSql("now()");

                entity.HasMany(d => d.Tags)
                    .WithMany(p => p.Files)
                    .UsingEntity<Dictionary<string, object>>(
                        "TagOnFile",
                        l => l.HasOne<FileTag>()
                            .WithMany()
                            .HasForeignKey("TagId")
                            .HasConstraintName("_TagOnFile__FK_1"),
                        r => r.HasOne<File>()
                            .WithMany()
                            .HasForeignKey("FileId")
                            .HasConstraintName("_TagOnFile__FK"),
                        j =>
                        {
                            j.HasKey("FileId", "TagId")
                                .HasName("TagOnFile__pk");

                            j.ToTable("TagOnFile");

                            j.HasIndex(new[] { "TagId" }, "IX_TagOnFile_TagID");

                            j.HasIndex(new[] { "FileId", "TagId" }, "_TagOnFile___FileID__IDX");

                            j.IndexerProperty<int>("FileId")
                                .HasColumnName("FileID");

                            j.IndexerProperty<int>("TagId")
                                .HasColumnName("TagID");
                        });
            });
        }

        public File()
        {
            AudioTracks = new HashSet<AudioTrack>();
            MenuItems = new HashSet<MenuItem>();
            Models = new HashSet<Model>();
            Signs = new HashSet<Sign>();
            Stations = new HashSet<Station>();
            VideoClips = new HashSet<VideoClip>();
            Texts = new HashSet<Text>();
            Tags = new HashSet<FileTag>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Mime { get; set; }
        public DateTime Timestamp { get; set; }
        public int Size { get; set; }
        public string Copyright { get; set; }
        public DateOnly? CopyrightDate { get; set; }
        public string AltMime { get; set; }

        public virtual FileContent FileContent { get; set; }
        public virtual Gsvmetadatum Gsvmetadatum { get; set; }
        public virtual ICollection<AudioTrack> AudioTracks { get; set; }
        public virtual ICollection<MenuItem> MenuItems { get; set; }
        public virtual ICollection<Model> Models { get; set; }
        public virtual ICollection<Sign> Signs { get; set; }
        public virtual ICollection<Station> Stations { get; set; }
        public virtual ICollection<VideoClip> VideoClips { get; set; }
        public virtual ICollection<Text> Texts { get; set; }

        public virtual ICollection<FileTag> Tags { get; set; }
    }
}
