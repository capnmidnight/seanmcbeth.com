using Microsoft.EntityFrameworkCore;

using System.Linq.Expressions;
using System.Security.Principal;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        private IQueryable<UserProfile> FindUserProfiles(Expression<Func<UserProfile, bool>> predicate) =>
            UserProfiles
                .Include(u => u.User)
                .Include(u => u.Organization)
                .Include(u => u.Room)
                .Where(predicate);

        private Task<UserProfile> FindUserProfileAsync(Expression<Func<UserProfile, bool>> predicate) =>
            FindUserProfiles(predicate)
                .SingleOrDefaultAsync();

        private IEnumerable<UserOutput> FindFullUsers(Expression<Func<UserProfile, bool>> predicate)
        {
            var anon = Organizations.Single(o => o.Name == "Anonymous");
            return FindUserProfiles(predicate)
                .AsEnumerable()
                .Select(userProfile =>
                    new UserOutput(userProfile, anon, UserRoles
                        .Where(ur => ur.UserId == userProfile.UserId)
                        .Join(Roles,
                            ur => ur.RoleId,
                            r => r.Id,
                            (o, r) => r.Name)));
        }

        private UserOutput GetUserProfileWithRoles(Expression<Func<UserProfile, bool>> predicate) =>
            FindFullUsers(predicate)
                .SingleOrDefault();

        public Task<UserProfile> GetUserProfileAsync(string userID) =>
            FindUserProfileAsync(u => u.UserId == userID);

        public IEnumerable<UserOutput> GetFullUsers() =>
            FindFullUsers(_ => true)
                .OrderBy(u => u.UserName);

        public UserOutput GetUserProfileWithRoles(string userID) =>
            GetUserProfileWithRoles(u => u.UserId == userID);

        public IEnumerable<UserOutput> GetUserProfilesWithRoles(string roleName = null, int? orgId = null) =>
            FindFullUsers(u => orgId == null || u.OrganizationID == orgId)
                .AsEnumerable()
                .Where(u => roleName is null || u.IsInRole(roleName));

        public UserOutput GetCurrentUserWithRoles(IPrincipal claim) =>
            GetUserProfileWithRoles(u => u.User.UserName == claim.Identity.Name)
                ?? new UserOutput(Organizations.Single(o => o.Name == "Anonymous"));

        public async Task<UserProfile> GetCurrentUserProfileAsync(IPrincipal claim) =>
            await FindUserProfileAsync(u => u.User.UserName == claim.Identity.Name)
                ?? new UserProfile
                {
                    Organization = Organizations.Single(o => o.Name == "Anonymous")
                };
    }
}
