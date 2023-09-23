using Microsoft.EntityFrameworkCore;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public async Task<IEnumerable<ReportSummary>> GetReportSummariesAsync(int? orgId, string userID = null)
        {
            var scenarios = await Scenarios
                .Include(s => s.ScenarioGroup)
                    .ThenInclude(sg => sg.Language)
                .Include(s => s.ScenarioGroup)
                    .ThenInclude(sg => sg.Organizations)
                .Where(s => s.ScenarioGroup.Organizations.Any(o => orgId == null || o.Id == orgId))
                .ToDictionaryAsync(s => s.Id);

            return Reports
                .Where(r => userID == null || r.UserId == userID)
                .Include(r => r.User)
                    .ThenInclude(u => u.User)
                .Include(r => r.Logs)
                .Where(r => orgId == null || r.User.OrganizationID == orgId)
                .OrderBy(r => r.Timestamp)
                .Select(r => new ReportSummary(r, scenarios));
        }
    }
}
