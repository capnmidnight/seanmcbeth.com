using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Roles
{
    public class DetailModel : EditorPageModel
    {
        private readonly RoleManager<IdentityRole> roles;
        private readonly UserManager<IdentityUser> users;

        public IdentityRole Role { get; private set; }
        public bool CanDelete { get; private set; }

        public DetailModel(YarrowContext db, UserManager<IdentityUser> u, RoleManager<IdentityRole> r, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "role", env, logger)
        {
            roles = r;
            users = u;
        }

        public async Task<IActionResult> OnGetAsync([FromRoute] string roleName)
        {
            if (!CurrentUser.IsManager)
            {
                return Forbid();
            }

            if (string.IsNullOrEmpty(roleName))
            {
                return NotFound();
            }

            Role ??= await roles.FindByNameAsync(roleName);
            if (Role is null)
            {
                return NotFound();
            }

            CanDelete = !(await users.GetUsersInRoleAsync(roleName)).Any();

            return Page();
        }

        public Task<IActionResult> OnPostSetUserAsync([FromRoute] string roleName, [FromForm] UserIDInput input) =>
            WithStatusReportAsync("set user in", () => OnGetAsync(roleName), async () =>
            {
                if (string.IsNullOrEmpty(roleName))
                {
                    throw new FileNotFoundException(roleName);
                }

                Role = await roles.FindByNameAsync(roleName);
                if (Role is null)
                {
                    throw new FileNotFoundException(roleName);
                }

                if (string.IsNullOrEmpty(input?.UserID))
                {
                    throw new Exception("System error");
                }

                var user = await users.FindByIdAsync(input.UserID);
                if (user is null)
                {
                    throw new FileNotFoundException(input.UserID);
                }

                var (added, result) = await users.ToggleUserRole(user, roleName);
                result.Check();

                var slug = added ? "added to" : "removed from";

                return $"User {user.Email} {slug} role {roleName}";
            });

        public Task<IActionResult> OnPostDeleteAsync([FromRoute] string roleName) =>
            WithStatusReportAsync("delete",
                () => OnGetAsync(roleName),
                async () =>
                {
                    if (string.IsNullOrEmpty(roleName))
                    {
                        throw new InvalidOperationException("No role name provided");
                    }

                    var role = await roles.FindByNameAsync(roleName)
                        ?? throw new FileNotFoundException("Role not found");

                    var count = (await users.GetUsersInRoleAsync(roleName)).Count;
                    if (count > 0)
                    {
                        throw new BadHttpRequestException("Role still has users assigned");
                    }

                    var result = await roles.DeleteAsync(role);
                    result.Check();

                    return $"redirect:~/Editor/Roles";
                });
    }
}
