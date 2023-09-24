using Juniper.Data;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<UserProfile> UserProfiles { get; set; }
    }

    public partial class UserProfile
    {
        [Key]
        [ForeignKey(nameof(User))]
        public string UserId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public IdentityUser? User { get; set; }

        [ForeignKey(nameof(Organization))]
        public int? OrganizationID { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Organization? Organization { get; set; }

        [ForeignKey(nameof(Room))]
        public int? RoomID { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public Room? Room { get; set; }

        public string FullName { get; set; }

        public string DisplayName { get; set; }

        [DefaultValueSql("CURRENT_TIMESTAMP")]
        public DateTime? CreatedOn { get; set; }

        public IEnumerable<Scenario> ScenarioGroups { get; set; } = new HashSet<Scenario>();

        [InverseProperty(nameof(ScenarioSnapshot.CreatedBy))]
        public IEnumerable<ScenarioSnapshot> CreatedScenarios { get; set; } = new HashSet<ScenarioSnapshot>();

        [InverseProperty(nameof(ScenarioSnapshot.PublishedBy))]
        public IEnumerable<ScenarioSnapshot> PublishedScenarios { get; set; } = new HashSet<ScenarioSnapshot>();

        public IEnumerable<Log> Logs { get; set; } = new HashSet<Log>();
        public IEnumerable<Report> Reports { get; set; } = new HashSet<Report>();

    }
}
