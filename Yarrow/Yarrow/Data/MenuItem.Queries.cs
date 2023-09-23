using Microsoft.EntityFrameworkCore;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public IQueryable<MenuItemOutput> GetMenu(int? orgId, bool isAdmin = false) =>
            MenuItems
                .Include(m => m.File)
                .Include(m => m.ScenarioGroup)
                    .ThenInclude(sg => sg.Scenarios
                        .Where(s => s.Published == true)
                        .OrderByDescending(s => s.Version))
                        .ThenInclude(s => s.Transforms)
                            .ThenInclude(t => t.AudioTracks)
                .Include(m => m.Organization)
                .Where(m => isAdmin
                    || ((orgId == null && m.Organization.Name == "Anonymous")
                    || (orgId != null && m.OrganizationId == orgId)))
                .Select(m => new MenuItemOutput(m));

    }
}
