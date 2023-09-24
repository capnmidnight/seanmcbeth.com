using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<StationConnection> StationConnections { get; set; }
    }

    public partial class StationConnection
    {
        [Key]
        [ForeignKey(nameof(Transform))]
        public int TransformId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Transform? Transform { get; set; }

        [ForeignKey(nameof(FromStation))]
        public int FromStationId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Station? FromStation { get; set; }

        [ForeignKey(nameof(ToStation))]
        public int ToStationId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Station? ToStation { get; set; }

        public string Label { get; set; }
    }
}
