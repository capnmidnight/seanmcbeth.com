using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Room> Rooms { get; set; }
    }

    public partial class Room
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Room>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("ID");

                entity.Property(e => e.Name)
                    .IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasDefaultValueSql("now()");

                entity.HasIndex(e => new { e.Id, e.Name, e.Timestamp });
            });
        }

        public Room()
        {
            Users = new HashSet<UserProfile>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Timestamp { get; set; }

        public virtual ICollection<UserProfile> Users { get; set; }
    }
}
