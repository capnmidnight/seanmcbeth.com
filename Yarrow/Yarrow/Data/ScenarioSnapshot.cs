using Juniper.Data;

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<ScenarioSnapshot> ScenariosSnapshots { get; set; }
    }

    public partial class ScenarioSnapshot
    {
        public int Id { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public string CreatedById { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public UserProfile? CreatedBy { get; set; }

        [ForeignKey(nameof(PublishedBy))]
        public string? PublishedById { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public UserProfile? PublishedBy { get; set; }

        [ForeignKey(nameof(StartStation))]
        public int? StartStationId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Station? StartStation { get; set; }

        [ForeignKey(nameof(ScenarioGroup))]
        public int ScenarioGroupId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Scenario? ScenarioGroup { get; set; }

        [DefaultValueSql("CURRENT_TIMESTAMP")]
        public DateTime CreatedOn { get; set; }
        public int Version { get; set; }
        public bool Published { get; set; }
        public DateTime? PublishedOn { get; set; }
        public float StartRotation { get; set; }
        public float? OriginAltitude { get; set; }
        public float? OriginLatitude { get; set; }
        public float? OriginLongitude { get; set; }

        public ICollection<Transform> Transforms { get; set; } = new HashSet<Transform>();
    }
}
