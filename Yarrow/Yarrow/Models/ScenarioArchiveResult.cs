using Juniper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

using System.IO.Compression;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ScenarioArchiveResult : IActionResult
    {
        private readonly YarrowContext db;
        private readonly int scenarioID;
        private readonly int? orgId;
        private readonly ILogger logger;

        public ScenarioArchiveResult(YarrowContext db, int? orgId, ScenarioSnapshot scenario, ILogger logger)
        {
            this.db = db;
            this.orgId = orgId;
            scenarioID = scenario.Id;
            this.logger = logger;
        }

        /// <summary>
        /// Performs the stream operation.
        /// </summary>
        /// <param name="actionContext"></param>
        /// <returns></returns>
        public async Task ExecuteResultAsync(ActionContext actionContext)
        {
            if (actionContext is null)
            {
                throw new ArgumentNullException(nameof(actionContext));
            }

            var httpContext = actionContext.HttpContext;
            var response = httpContext.Response;
            response.StatusCode = StatusCodes.Status200OK;
            response.ContentType = MediaType.Application_Zip;

            try
            {
                var scenario = await db.GetFullScenarioOutputAsync(orgId, scenarioID);

                response.Headers[HeaderNames.ContentDisposition] = $"attachment; filename=\"{MediaType.Application_Zip.AddExtension(scenario.Name)}\"";

                using var zip = new ZipArchive(response.Body, ZipArchiveMode.Create);
                await db.ExportScenarioAsync(zip, scenario, httpContext.RequestAborted);
            }
            catch (OperationCanceledException exp)
            {
                logger.LogWarning(exp, "Download cancelled: {path}", actionContext.HttpContext.Request.Path);
            }
            catch (Exception exp)
            {
                logger.LogError(exp, "Download error: {path}", actionContext.HttpContext.Request.Path);
            }
        }
    }
}