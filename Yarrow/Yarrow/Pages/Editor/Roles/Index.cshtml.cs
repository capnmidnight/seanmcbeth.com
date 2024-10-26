using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Roles
{
    public class IndexModel : EditorPageModel
    {
        private readonly RoleManager<IdentityRole> roles;

        public IdentityRole[] Roles { get; private set; }
        public Dictionary<string, int> RoleUserCounts { get; private set; }

        public IndexModel(YarrowContext db, RoleManager<IdentityRole> r, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "role", env, logger)
        {
            roles = r;
        }

        public async Task<IActionResult> OnGetAsync()
        {
            if (!CurrentUser.IsManager)
            {
                return Forbid();
            }

            Roles = await roles.GetRoles(CurrentUser)
                .ToArrayAsync();

            RoleUserCounts = new();
            foreach(var role in Roles)
            {
                RoleUserCounts.Add(role.Name, 0);
            }

            foreach(var user in Database.GetUserProfilesWithRoles(null, CurrentUser.VisibleOrganizationID))
            {
                foreach(var roleName in user.Roles)
                {
#pragma warning disable CA1854 // Prefer the 'IDictionary.TryGetValue(TKey, out TValue)' method
                    if (RoleUserCounts.ContainsKey(roleName))
                    {
                        ++RoleUserCounts[roleName];
                    }
#pragma warning restore CA1854 // Prefer the 'IDictionary.TryGetValue(TKey, out TValue)' method
                }
            }

            return Page();
        }

        public Task<IActionResult> OnPostCreate([FromForm] NameInput input) =>
            WithStatusReportAsync("create",
                OnGetAsync,
                async () =>
                {
                    if (string.IsNullOrEmpty(input?.Name))
                    {
                        throw new Exception("No valid role name provided.");
                    }

                    if (await roles.RoleExistsAsync(input.Name))
                    {
                        throw new Exception($"{input.Name} already exists.");
                    }

                    var role = new IdentityRole
                    {
                        Name = input.Name,
                        NormalizedName = input.Name.ToUpperInvariant()
                    };

                    var result = await roles.CreateAsync(role);
                    result.Check();

                    return $"redirect:~/Editor/Roles/Detail/{role.Name}";
                });
    }
}
