using Juniper;
using Juniper.Configuration;

using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class LayoutModel : EditorPageModel
    {
        public Version AppVersion { get; }

        public ScenarioSnapshot Scenario { get; private set; }

        public LayoutModel(YarrowContext db, IConfiguration config, IWebHostEnvironment env, ILogger<LayoutModel> logger)
            : base(db, "layout", env, logger)
        {
            AppVersion = config.GetVersion();
        }

        public async Task<IActionResult> OnGetAsync(int scenarioID)
        {
            if (Request.Accepts(MediaType.Application_Json))
            {
                // Instead of parsing the scenario ID out of the page URL in the JavaScript
                // code, I just make the current location able to serve both JSON and pages.
                var scenario = await Database.GetFullScenarioOutputAsync(CurrentUser.VisibleOrganizationID, scenarioID);
                return new ObjectResult(scenario);
            }
            else
            {
                if (!CurrentUser.IsEditor)
                {
                    return Forbid();
                }

                Scenario = await Database.ScenariosSnapshots
                    .Include(s => s.ScenarioGroup)
                        .ThenInclude(sg => sg.Organizations)
                    .FirstOrDefaultAsync(s => s.Id == scenarioID);

                if(!CurrentUser.IsAdmin && !Scenario.ScenarioGroup.Organizations.Any(o => o.Id == CurrentUser.OrganizationID))
                {
                    return Forbid();
                }

                return Page();
            }
        }

        private async Task<IActionResult> WithScenarioAsync(int scenarioID, Func<ScenarioSnapshot, Task<IActionResult>> action)
        {
            var scenario = Database.ScenariosSnapshots.SingleOrDefault(s => s.Id == scenarioID);
            if (scenario is null)
            {
                return NotFound();
            }

            return await action(scenario);
        }

        private IActionResult WithScenario(int scenarioID, Func<ScenarioSnapshot, IActionResult> action)
        {
            var scenario = Database.ScenariosSnapshots.SingleOrDefault(s => s.Id == scenarioID);
            if (scenario is null)
            {
                return NotFound();
            }

            return action(scenario);
        }

        public Task<IActionResult> OnPostSetOriginAsync(int scenarioID, [FromBody] LatLngInput origin) =>
            WithScenarioAsync(scenarioID, async (scenario) =>
            {
                if (origin is null)
                {
                    return BadRequest();
                }

                scenario.OriginLatitude = origin.Lat;
                scenario.OriginLongitude = origin.Lng;
                scenario.OriginAltitude = origin.Alt;

                await Database.SaveChangesAsync();

                return new OkResult();
            });

        public Task<IActionResult> OnPostPublishAsync(int scenarioID) =>
            WithScenarioAsync(scenarioID, async (scenario) =>
            {
                scenario.Published = true;
                scenario.PublishedOn = DateTime.UtcNow;
                scenario.PublishedById = CurrentUser.UserID;
                await Database.SaveChangesAsync();
                return new OkResult();
            });

        public Task<IActionResult> OnPostForkAsync(int scenarioID) =>
            WithScenarioAsync(scenarioID, async (scenario) =>
            {
                var newScenario = await Database.BumpScenarioVersionAsync(CurrentUser.VisibleOrganizationID, scenarioID, CurrentUser.UserID);
                return new ObjectResult(newScenario.Id);
            });

        public IActionResult OnGetExport(int scenarioID) =>
            WithScenario(scenarioID, (scenario) =>
            {
                var syncIOFeature = HttpContext.Features.Get<IHttpBodyControlFeature>();
                if (syncIOFeature != null)
                {
                    syncIOFeature.AllowSynchronousIO = true;
                }

                return new ScenarioArchiveResult(Database, CurrentUser.VisibleOrganizationID, scenario, Logger);
            });
    }

    public class LatLngInput
    {
        public float Lat { get; set; }
        public float Lng { get; set; }
        public float Alt { get; set; }
    }
}
