using Juniper;

using Microsoft.AspNetCore.Identity;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class UserOutput
    {
        private readonly IdentityUser user;
        private readonly Organization org;
        private readonly Room room;
        private readonly UserProfile headset;
        private readonly UserProfile headsetUser;

        public string UserName => user?.UserName;
        public string UserID => user?.Id;
        public string Email => user?.Email;
        public DateTimeOffset? LockoutEnd => user?.LockoutEnd;
        public bool HasPassword => user?.PasswordHash is not null;

        public string UserType =>
            IsStudent
                ? "Student"
                : IsInstructor
                    ? "Instructor"
                    : null;

        public int? OrganizationID => org?.Id;
        public string OrganizationName => org?.Name;

        public int? VisibleOrganizationID =>
            IsAdmin
                ? null
                : OrganizationID;

        public int? RoomID => room?.Id;
        public string RoomName => room?.Name;

        public string HeadsetID => headset?.UserId;
        public string HeadsetName => headset?.User?.UserName;

        public string HeadsetUserID => headsetUser?.UserId;
        public string HeadsetUserName => headsetUser?.User?.UserName;

        public string FullName { get; }
        public string DisplayName { get; }
        public string RolesString { get; }

        public DateTime? CreatedOn { get; }

        public HashSet<string> Roles { get; }

        public UserOutput(Organization anon)
        {
            user = null;
            org = anon;
            room = null;
            headset = null;
            headsetUser = null;

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
            headset = profile?.Headset;
            headsetUser = profile?.HeadsetUser;

            // In which room is the user located (who might be impersonated by a headset)
            room = headset?.Room // user is logged in as themsleves, but they have a headset assigned to them, and the headset is assigned to a room
                ?? profile?.Room // user or headset is logged in as themselves, they have no headset
                ?? headsetUser?.Room; // headset is logged in as itself, a user is assigned to it, and the user has a room assign

            FullName = profile?.FullName;
            DisplayName = profile?.DisplayName;
            RolesString = roles
                .OrderBy(Always.Identity)
                .ToString(", ");

            CreatedOn = profile?.Timestamp;

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

        public bool IsHeadset => IsInRole(Role.Headset);

        public bool IsDeveloper => IsInRole(Role.Developer);

        public bool IsAdmin => IsDeveloper || IsInRole(Role.Admin);

        public bool IsEditor => IsAdmin || IsInRole(Role.Editor);

        public bool IsManager => IsAdmin || IsInRole(Role.Manager);

        public bool CanViewBackend => IsEditor || IsManager;
    }
}
