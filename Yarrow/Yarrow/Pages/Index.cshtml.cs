using Juniper.Configuration;

using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages
{
    public class IndexModel : DbPageModel
    {
        public Version AppVersion { get; }

        public int? ScenarioID { get; private set; }

        public IndexModel(YarrowContext db, IConfiguration config)
            : base(db)
        {
            AppVersion = config.GetVersion();
        }

        public IActionResult OnGet(int? scenarioID)
        {
            if (scenarioID is not null
                && !Database.ScenariosSnapshots.Any(s => s.Id == scenarioID))
            {
                return NotFound();
            }

            ScenarioID = scenarioID;
            return Page();
        }

        public async Task<IActionResult> OnPost([FromBody] LogInput log) =>
            new ObjectResult(await Database.LogActivity(Request, CurrentUser.UserID, log));
    }
}
