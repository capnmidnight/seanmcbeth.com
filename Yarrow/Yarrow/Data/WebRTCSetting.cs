using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<WebRTCSetting> WebRTCSettings { get; set; }
    }

    public partial class WebRTCSetting
    {
        public int Id { get; set; }
        public required string Protocol { get; set; }
        public required string Host { get; set; }
        public required int Port { get; set; }
        public bool Enabled { get; set; } = true;
    }
}
