using Microsoft.AspNetCore.Identity;

using Juniper.Logic;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class UserOutput
    {
        private readonly IdentityUser? user;
        private readonly Organization org;
        private readonly Room? room;

        public string? UserName => user?.UserName;
        public string? UserID => user?.Id;
        public string? Email => user?.Email;
        public DateTimeOffset? LockoutEnd => user?.LockoutEnd;
        public bool HasPassword => user?.PasswordHash is not null;

        public string? UserType =>
            IsStudent
                ? "Student"
                : IsInstructor
                    ? "Instructor"
                    : null;

        public int? OrganizationID => org?.Id;
        public string? OrganizationName => org?.Name;

        public int? VisibleOrganizationID =>
            IsAdmin
                ? null
                : OrganizationID;

        public int? RoomID => room?.Id;
        public string? RoomName => room?.Name;

        public string? FullName { get; }
        public string? DisplayName { get; }
        public string RolesString { get; }

        public DateTime? CreatedOn { get; }

        public HashSet<string> Roles { get; }

        public UserOutput(Organization anon)
        {
            user = null;
            org = anon;
            room = null;

            FullName = null;
            DisplayName = null;
            RolesString = "";

            CreatedOn = null;

            Roles = new HashSet<string>();
        }

        public UserOutput(UserProfile profile, Organization anon, IEnumerable<string> roles)
        {
            user = profile?.User;
            org = profile?.Organization ?? anon;
            room = profile?.Room;
            FullName = profile?.FullName;
            DisplayName = profile?.DisplayName;
            RolesString = roles
                .OrderBy(Always.Identity)
                .ToString(", ");

            CreatedOn = profile?.CreatedOn;

            Roles = new HashSet<string>(roles);
        }

        public bool IsInRole(IdentityRole idRole) =>
            IsInRole(idRole.Name);

        public bool IsInRole(Role role) =>
            IsInRole(role.ToString());

        public bool IsInRole(string roleName) =>
            Roles.Contains(roleName);

        public bool IsAnonymous => user is null;

        public bool IsStudent => IsInRole(Role.Student);

        public bool IsInstructor => IsInRole(Role.Instructor);

        public bool IsDeveloper => IsInRole(Role.Developer);

        public bool IsAdmin => IsDeveloper || IsInRole(Role.Admin);

        public bool IsEditor => IsAdmin || IsInRole(Role.Editor);

        public bool IsManager => IsAdmin || IsInRole(Role.Manager);

        public bool CanViewBackend => IsEditor || IsManager;
    }
}
