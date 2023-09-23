using Microsoft.AspNetCore.Identity;

using Yarrow.Models;

namespace Yarrow.Data
{
    public enum Role
    {
        Developer,
        Admin,
        Editor,
        Manager,

        Instructor,
        Student,

        Headset
    }

    public static class IdentityExt
    {
        private static readonly Dictionary<Role, Role[]> ExclusiveRoles = new()
        {
            { Role.Developer, new []{ Role.Admin, Role.Editor, Role.Manager, Role.Headset } },
            { Role.Admin, new[]{ Role.Developer, Role.Editor, Role.Manager, Role.Headset } },
            { Role.Editor, new []{ Role.Developer, Role.Admin, Role.Headset } },
            { Role.Manager , new []{ Role.Developer, Role.Admin, Role.Headset } },

            { Role.Instructor, new [] { Role.Student, Role.Headset } },
            { Role.Student, new [] { Role.Instructor, Role.Headset } },

            { Role.Headset, new []{ Role.Developer, Role.Admin, Role.Editor, Role.Manager, Role.Instructor, Role.Student } }
        };

        public static IQueryable<IdentityRole> GetRoles(this RoleManager<IdentityRole> roles, UserOutput currentUser) =>
            roles.Roles
                .Where(r => currentUser.IsAdmin || (
                    r.Name != "Admin"
                    && r.Name != "Developer"
                    && r.Name != "Headset"
                ))
                .OrderBy(r => r.Name);

        public static Task<bool> IsInRoleAsync(this UserManager<IdentityUser> users, IdentityUser user, Role role) =>
            users.IsInRoleAsync(user, role.ToString());

        public static Task<IList<IdentityUser>> GetUsersInRoleAsync(this UserManager<IdentityUser> users, Role role) =>
            users.GetUsersInRoleAsync(role.ToString());

        public static Task<IdentityResult> AddToRoleAsync(this UserManager<IdentityUser> users, IdentityUser user, Role role) =>
            users.AddToRoleAsync(user, role.ToString());

        public static Task<IdentityResult> RemoveFromRoleAsync(this UserManager<IdentityUser> users, IdentityUser user, Role role) =>
            users.RemoveFromRoleAsync(user, role.ToString());

        public static async Task<(bool added, IdentityResult result)> ToggleUserRole(this UserManager<IdentityUser> users, IdentityUser user, string roleName)
        {

            var isAdd = !await users.IsInRoleAsync(user, roleName);

            if (isAdd && Enum.TryParse<Role>(roleName, out var role))
            {
                var exclusions = ExclusiveRoles[role];
                foreach (var exclusion in exclusions)
                {
                    if (await users.IsInRoleAsync(user, exclusion))
                    {
                        await users.RemoveFromRoleAsync(user, exclusion);
                    }
                }
            }

            return (
                isAdd,
                isAdd
                ? await users.AddToRoleAsync(user, roleName)
                : await users.RemoveFromRoleAsync(user, roleName));
        }
    }
}
