using Juniper;
using Juniper.HTTP;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor
{
    public partial class MenuModel : EditorPageModel
    {
        public int? SelectedMenuItemID { get; private set; }
        public bool IsAdmin { get; private set; }
        public int? CurrentOrgId { get; private set; }
        public IEnumerable<Organization> Organizations { get; private set; }

        public MenuModel(YarrowContext db, IWebHostEnvironment env, ILogger<MenuModel> logger)
            : base(db, "menu", env, logger)
        {
        }

        public IActionResult OnGet(int? id, [FromQuery] int? orgId)
        {
            if (!CurrentUser.IsEditor)
            {
                return Forbid();
            }

            orgId ??= CurrentUser.VisibleOrganizationID;

            if (!CurrentUser.IsAdmin && orgId != CurrentUser.OrganizationID)
            {
                return Forbid();
            }

            if (Request.Accepts(MediaType.Application_Json))
            {
                return new ObjectResult(Database.GetMenu(orgId));
            }
            else
            {
                IsAdmin = CurrentUser.IsAdmin;
                SelectedMenuItemID = id;
                CurrentOrgId = orgId;
                if (IsAdmin)
                {
                    Organizations = Database.Organizations;
                    if (SelectedMenuItemID is not null)
                    {
                        CurrentOrgId = Database.MenuItems
                            .FirstOrDefault(m => m.Id == SelectedMenuItemID)
                            ?.OrganizationId;
                    }
                }
                return Page();
            }
        }

        public record CreateMenuItemInput(int? OrganizationID, int? ParentID, int? ScenarioGroupID);

        public Task<IActionResult> OnPostCreateAsync(int? id, [FromForm] CreateMenuItemInput input) =>
            WithStatusReportAsync("create",
                () => OnGet(id, null),
                async () =>
                {
                    var sg = await Database.ScenarioGroups
                        .Include(sg => sg.Language)
                        .Include(sg => sg.Scenarios
                            .Where(s => s.Published == true))
                        .SingleOrDefaultAsync(a => a.Id == input.ScenarioGroupID);
                    if (input?.ScenarioGroupID is not null && sg is null)
                    {
                        throw new FileNotFoundException();
                    }

                    if (CurrentUser is null || CurrentUser.OrganizationID is null)
                    {
                        throw new UnauthorizedAccessException();
                    }

                    int orgId = input?.OrganizationID ?? CurrentUser.OrganizationID
                        ?? throw new InvalidDataException();

                    int? parentId = input?.ParentID;
                    if (parentId is null && sg is not null)
                    {
                        var langMenuItem = await Database.MenuItems
                            .FirstOrDefaultAsync(m =>
                                m.OrganizationId == orgId
                                && m.Label.Trim().ToLower() == sg.Language.Name.Trim().ToLower());
                        parentId = langMenuItem?.Id;
                    }

                    var numSiblings = Database.MenuItems
                        .Where(m => m.ParentId == parentId)
                        .Count();

                    var m = new MenuItem
                    {
                        OrganizationId = orgId,
                        ParentId = parentId,
                        Label = sg?.Name ?? "New menu item",
                        Order = numSiblings,
                        ScenarioGroup = sg
                    };

                    Database.MenuItems.Add(m);
                    await Database.SaveChangesAsync();

                    if (Request.Accepts(MediaType.Application_Json))
                    {
                        var output = new MenuItemOutput(m);
                        throw new ObjectResultHack(output);
                    }
                    else
                    {
                        return $"redirect:~/Editor/Menu/{m.Id}";
                    }
                });

        public IActionResult OnPostUpdate([FromBody] MenuItemUpdateInput[] items)
        {
            var existing = Database.MenuItems
                .AsEnumerable()
                .ToDictionary(m => m.Id);

            foreach (var item in items)
            {
                var m = existing[item.ID];

                m.ParentId = item.ParentID;
                m.Order = item.Order;
                m.Label = item.Label;
                m.FileId = item.FileID;
                m.ScenarioGroupId = item.ScenarioGroupID;
            }

            Database.SaveChanges();
            return new OkResult();
        }

        public IActionResult OnPostDelete([FromBody] int id)
        {
            var menuItem = Database.MenuItems.Single(m => m.Id == id);
            Database.MenuItems.Remove(menuItem);
            Database.SaveChanges();
            return new OkResult();
        }
    }
}
