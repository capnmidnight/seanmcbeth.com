using Juniper;

using Microsoft.AspNetCore.Mvc;

using System.Numerics;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    [DisableRequestSizeLimit,
        RequestFormLimits(
            MultipartBodyLengthLimit = int.MaxValue,
            MultipartHeadersLengthLimit = int.MaxValue,
            ValueLengthLimit = int.MaxValue)]
    public class IndexModel : EditorPageModel
    {
        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "scenario", env, logger)
        {
        }

        public async Task<IActionResult> OnGetAsync([FromQuery] int? orgId)
        {
            if (!CurrentUser.IsEditor)
            {
                return Forbid();
            }

            orgId ??= CurrentUser.VisibleOrganizationID;


            if (Request.Accepts(MediaType.Application_Json))
            {
                // This is used by the menu editor to list the scenarios that can be selected
                var scenarios = (await Database.GetScenarioGroupOutputsAsync(orgId))
                    .Where(sg => sg.Scenarios.Any(s => s.Published));
                return new ObjectResult(scenarios);
            }
            else
            {
                return Page();
            }
        }

        public Task<IActionResult> OnPostImportAsync([FromForm] FileInput form) =>
            WithStatusReportAsync("import",
                () => OnGetAsync(null),
                async () =>
                {
                    var contentType = form?.FormFile?.ContentType;
                    if (contentType != MediaType.Application_Zip
                        && contentType != MediaType.Application_X_Zip_Compressed)
                    {
                        throw new BadHttpRequestException("No form data");
                    }

                    using var zipStream = form.FormFile.OpenReadStream();
                    var scenarioGroup = await Database.ImportScenarioAsync(zipStream, CurrentUser.UserID);
                    return $"redirect:~/Editor/Scenarios/Detail/{scenarioGroup.Id}";
                });

        public Task<IActionResult> OnPostCreateAsync([FromForm] ScenarioInputModel input) =>
            WithStatusReportAsync("create",
                () => OnGetAsync(null),
                async () =>
                {
                    input.OrganizationId ??= CurrentUser.VisibleOrganizationID;

                    var orgs = new HashSet<Organization>();
                    if (input.OrganizationId is not null)
                    {
                        orgs.Add(Database.Organizations.Single(o => o.Id == input.OrganizationId));
                    }

                    var group = new Scenario
                    {
                        Name = input.Name,
                        Organizations = orgs,
                        CreatedById = CurrentUser.UserID
                    };

                    var scenario = new ScenarioSnapshot
                    {
                        ScenarioGroup = group,
                        CreatedById = CurrentUser.UserID,
                        Transforms = new[]
                        {
                            new Transform
                            {
                                Name = input.Name,
                                Matrix = Matrix4x4.Identity.ToArray()
                            }
                        }
                    };
                    await Database.Scenarios.AddAsync(group);
                    await Database.ScenariosSnapshots.AddAsync(scenario);
                    await Database.SaveChangesAsync();
                    return $"redirect:~/Editor/Scenarios/Detail/{scenario.ScenarioGroupId}";
                });
    }
}
