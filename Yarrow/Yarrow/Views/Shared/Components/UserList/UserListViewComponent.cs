using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Views.Shared.Components.UserList
{
    public class UserListViewComponent : ViewComponent
    {
        private readonly YarrowContext db;
        private readonly RoleManager<IdentityRole> roleManager;

        public UserListViewComponent(YarrowContext db, RoleManager<IdentityRole> roleManager)
        {
            this.db = db;
            this.roleManager = roleManager; 
        }

        public record Model(
            bool AdminView,
            bool ShowCreateUser,
            string CreateUserName,
            string CreateUserEmail,
            string ResourceName,
            IdentityRole Role,
            Organization Organization,
            IEnumerable<IdentityRole> Roles,
            IEnumerable<Organization> Organizations,
            IEnumerable<UserOutput> Users);

        public async Task<IViewComponentResult> InvokeAsync(
            UserOutput currentUser,
            string roleName = null,
            int? orgId = null,
            bool showCreateUser = false,
            string createUserName = null,
            string createUserEmail = null,
            string resourceName = null)
        {
            var roles = roleManager.GetRoles(currentUser);
            var role = roleName is null ? null : await roleManager.FindByNameAsync(roleName);

            var showOrgColumn = orgId is null;
            // restrict not-admin users to only seeing their own organization,
            // but let admin users see other organizations.
            orgId ??= currentUser.VisibleOrganizationID;

            // don't show the anonymous org in relation to users.
            var orgs = showOrgColumn ? db.Organizations.Where(o => o.Name != "Anonymous" && (orgId == null || o.Id == orgId)) : null;
            var org = !showOrgColumn ? db.Organizations.FirstOrDefault(o => o.Id == orgId) : null;

            if (currentUser.IsAdmin)
            {
                // let admins see all users for any org
                orgId = null;
                // let admins see all users for any role
                roleName = null;
            }

            var users = db.GetUserProfilesWithRoles(roleName, orgId).OrderBy(u => u.UserName);

            createUserName ??= createUserEmail;

            return View(new Model(
                currentUser.IsAdmin,
                showCreateUser,
                createUserName,
                createUserEmail,
                resourceName,
                role,
                org,
                roles,
                orgs,
                users));
        }
    }
}
