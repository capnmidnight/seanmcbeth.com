using Microsoft.EntityFrameworkCore;

using System.Data;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public IQueryable<Scenario> GetScenarioGroups(int? menuOrgId, int? orgId, string createdById) =>
            Scenarios
                .Include(g => g.Scenarios
                    .OrderByDescending(s => s.Version))
                    .ThenInclude(g => g.CreatedBy)
                        .ThenInclude(g => g.User)
                .Include(g => g.Scenarios)
                    .ThenInclude(g => g.PublishedBy)
                        .ThenInclude(g => g.User)
                .Include(g => g.MenuItems
                        .Where(m => menuOrgId == null || m.OrganizationId == menuOrgId))
                    .ThenInclude(m => m.File)
                .Include(g => g.Organizations)
                .Include(g => g.CreatedBy)
                    .ThenInclude(u => u.User)
                .Where(g => (orgId == null || g.Organizations.Any(org => org.Id == orgId))
                    && (createdById == null || g.CreatedById == createdById))
                .OrderBy(g => g.Name);

        public Task<ScenarioGroupOutput[]> GetScenarioGroupOutputsAsync(int? orgId) =>
            GetScenarioGroups(null, orgId, null)
                .Select(g => new ScenarioGroupOutput(g))
                .ToArrayAsync();
    }
}
