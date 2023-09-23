using Juniper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Reports
{
    public class IndexModel : EditorPageModel
    {
        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "reports", env, logger)
        {
        }

        public IEnumerable<ReportSummary> Reports { get; private set; }

        public IEnumerable<string> Names { get; set; }

        public IEnumerable<Language> Languages { get; set; }

        public IEnumerable<Scenario> Scenarios { get; set; }

        public async Task<IActionResult> OnGet()
        {
            if (!CurrentUser.IsManager)
            {
                return Forbid();
            }

            Reports = await Database.GetReportSummariesAsync(CurrentUser.VisibleOrganizationID);

            Names = Reports
                .Select(r => r.DisplayName)
                .Distinct()
                .OrderBy(Always.Identity);
            Languages = Database
                .Languages
                .OrderBy(l => l.Name);
            Scenarios = Database
                .Scenarios
                .Include(s => s.ScenarioGroup)
                    .ThenInclude(g => g.Language)
                .OrderBy(s => s.ScenarioGroup.Name);

            return Page();
        }
    }
}
