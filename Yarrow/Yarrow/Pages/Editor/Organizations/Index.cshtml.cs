using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Organizations
{
    public class IndexModel : EditorPageModel
    {
        [BindProperty]
        public Organization[] Organizations { get; private set; }

        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "organization", env, logger)
        {
        }

        public async Task<IActionResult> OnGetAsync()
        {
            if (!CurrentUser.IsManager)
            {
                return Forbid();
            }

            if (CurrentUser.VisibleOrganizationID is not null)
            {
                return Redirect($"~/Editor/Organizations/Detail/{CurrentUser.VisibleOrganizationID}");
            }

            Organizations = await Database
                .Organizations
                .Include(org => org.Users)
                .OrderBy(r => r.Name)
                .ToArrayAsync();

            return Page();
        }

        [BindProperty]
        public string Name { get; set; }

        public Task<IActionResult> OnPostCreate() =>
            WithStatusReportAsync("create", OnGetAsync, async () =>
            {
                if (string.IsNullOrEmpty(Name))
                {
                    throw new Exception("No valid organization name provided.");
                }

                if (Database.Organizations.Any(org => org.Name == Name))
                {
                    throw new Exception($"{Name} already exists.");
                }

                var org = new Organization
                {
                    Name = Name
                };

                Database.Organizations.Add(org);

                await Database.SaveChangesAsync();

                return $"redirect:~/Editor/Organizations/Detail/{org.Id}";
            });
    }
}
