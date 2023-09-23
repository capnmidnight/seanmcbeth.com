using Microsoft.EntityFrameworkCore;

using System.Linq.Expressions;
using System.Security.Principal;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        private IQueryable<UserProfile> FindUserProfiles(bool withHeadsetImpersonation, Expression<Func<UserProfile, bool>> predicate) =>
            UserProfiles
                .Include(u => u.User)
                .Include(u => u.Organization)
                .Include(u => u.Room)
                .Include(u => u.Headset)
                    .ThenInclude(h => h.User)
                .Include(u => u.Headset)
                    .ThenInclude(h => h.Organization)
                .Include(u => u.Headset)
                    .ThenInclude(h => h.Room)
                .Include(u => u.HeadsetUser)
                    .ThenInclude(h => h.User)
                .Include(u => u.HeadsetUser)
                    .ThenInclude(h => h.Organization)
                .Include(u => u.HeadsetUser)
                    .ThenInclude(h => h.Room)
                .Where(predicate)
                .Select(u => withHeadsetImpersonation && u.HeadsetUser != null
                    ? u.HeadsetUser
                    : u);

        private Task<UserProfile> FindUserProfileAsync(bool withHeadsetImpersonation, Expression<Func<UserProfile, bool>> predicate) =>
            FindUserProfiles(withHeadsetImpersonation, predicate)
                .SingleOrDefaultAsync();

        private IEnumerable<UserOutput> FindFullUsers(bool withHeadsetImpersonation, Expression<Func<UserProfile, bool>> predicate)
        {
            var anon = Organizations.Single(o => o.Name == "Anonymous");
            return FindUserProfiles(withHeadsetImpersonation, predicate)
                .AsEnumerable()
                .Select(userProfile =>
                    new UserOutput(userProfile, anon, UserRoles
                        .Where(ur => ur.UserId == userProfile.UserId)
                        .Join(Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (o, r) => r.Name)));
        }

        private UserOutput GetUserProfileWithRoles(bool withHeadsetImpersonation, Expression<Func<UserProfile, bool>> predicate) =>
            FindFullUsers(withHeadsetImpersonation, predicate)
                .SingleOrDefault();

        public Task<UserProfile> GetUserProfileAsync(string userID) =>
            FindUserProfileAsync(false, u => u.UserId == userID);

        public IEnumerable<UserOutput> GetFullUsers() =>
            FindFullUsers(false, _ => true)
                .OrderBy(u => u.UserName);

        public UserOutput GetUserProfileWithRoles(string userID) =>
            GetUserProfileWithRoles(false, u => u.UserId == userID);

        public IEnumerable<UserOutput> GetUserProfilesWithRoles(string roleName = null, int? orgId = null) =>
            FindFullUsers(false, u => orgId == null || u.OrganizationID == orgId)
                .AsEnumerable()
                .Where(u => roleName is null || u.IsInRole(roleName));

        public UserOutput GetCurrentUserWithRoles(IPrincipal claim) =>
            GetUserProfileWithRoles(true, u => u.User.UserName == claim.Identity.Name)
                ?? new UserOutput(Organizations.Single(o => o.Name == "Anonymous"));

        public async Task<UserProfile> GetCurrentUserProfileAsync(IPrincipal claim) =>
            await FindUserProfileAsync(true, u => u.User.UserName == claim.Identity.Name)
                ?? new UserProfile
                {
                    Organization = Organizations.Single(o => o.Name == "Anonymous")
                };
    }
}
