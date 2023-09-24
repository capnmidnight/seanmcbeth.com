using Juniper.Data;

using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<Room> Rooms { get; set; }
    }

    public partial class Room
    {
        public int Id { get; set; }
        public required string Name { get; set; }

        [DefaultValueSql("CURRENT_TIMESTAMP")]
        public DateTime CreatedOn { get; set; }

        public ICollection<UserProfile> Users { get; set; } = new HashSet<UserProfile>();
    }
}
