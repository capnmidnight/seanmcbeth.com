using Juniper;
using Juniper.Configuration;
using Juniper.HTTP;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Controllers.Public
{
    [ApiController, Route("vr")]
    public class VRFiles : ControllerBase
    {
        private readonly YarrowContext db;
        private readonly IWebHostEnvironment env;
        private readonly IConfiguration config;
        private readonly ILogger<VRFiles> logger;
        private readonly HttpClient http;

        private UserOutput _currentUser;
        public UserOutput CurrentUser =>
            _currentUser ??= db.GetCurrentUserWithRoles(User);

        public VRFiles(YarrowContext db, IWebHostEnvironment env, IConfiguration config, ILogger<VRFiles> logger, HttpClient http)
        {
            this.db = db;
            this.env = env;
            this.config = config;
            this.logger = logger;
            this.http = http;
        }

        [HttpGet("version")]
        public string GetVersion() =>
            config.GetVersion().ToString();

        [HttpGet("{scenarioID:int?}")]
        public IActionResult Index(int? scenarioID)
        {
            logger.LogInformation("Redirecting from old {Path}{QueryString} path", Request.Path, Request.QueryString);
            if (scenarioID is null)
            {
                return Redirect("/" + Request.QueryString);
            }
            else
            {
                return Redirect($"/{scenarioID}{Request.QueryString}");
            }
        }

        [HttpGet("file/{fileID:int}"),
            HttpHead("file/{fileID:int}")]
        public async Task<IActionResult> GetFileAsync(int fileID)
        {
            try
            {
                var file = await db.GetFileAsync(fileID);
                if (file is null)
                {
                    return NotFound();
                }

                if (MediaType.Application_X_Url.Matches(file.Mime))
                {
                    return await ProxyAsync(await db.GetFileAsText(fileID));
                }
                else
                {
                    var cacheTime = env.IsDevelopment()
                        ? 0
                        : IConfigurationExt.CACHE_TIME;

                    var range = Request.Headers[HeaderNames.Range]
                        .FirstOrDefault();

                    if (Request.Method == HttpMethods.Head)
                    {
                        var type = MediaType.Parse(file.Mime);
                        var fileName = type.AddExtension(file.Name);
                        return new FileInfoResult(file.Size, file.Mime, fileName, cacheTime, range, logger);
                    }
                    else
                    {
                        return await db.GetFileContent(fileID, range, cacheTime, logger);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Could get file path {fileID}", fileID);
                return new ServerErrorResult();
            }
        }

        private static bool IsYouTubePage(Uri uri) =>
            uri.Host == "www.youtube.com"
                    || uri.Host == "youtube.com"
                    || uri.Host == "youtu.be";

        private static bool IsFreeSoundPage(Uri uri) =>
            (uri.Host == "freesound.org"
                    || uri.Host == "www.freesound.org")
                    && !uri.PathAndQuery.StartsWith("/data/");

        [HttpGet("link"),
            HttpHead("link")]
        public async Task<IActionResult> ProxyAsync([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrEmpty(q)
                    || !Uri.TryCreate(q, UriKind.Absolute, out var uri))
                {
                    return NotFound();
                }
                else if (!IsYouTubePage(uri)
                    && !IsFreeSoundPage(uri))
                {
                    return await http.ProxyAsync(q, Request, Response);
                }
                else if (!YouTubeDLP.IsAvailable)
                {
                    logger.LogWarning("No YouTubeDLP. Tried:");
                    foreach (var path in YouTubeDLP.AttemptPaths)
                    {
                        logger.LogWarning("\t{path}", path);
                    }
                    return NotFound();
                }
                else
                {
                    var result = new ContentResult
                    {
                        ContentType = Options.Video_Vnd_DlsDc_YtDlp_Json,
                        StatusCode = 200
                    };

                    if (Request.Method == HttpMethods.Get)
                    {
                        result.Content = await YouTubeDLP.GetJSONString(http, q);
                    }

                    return result;
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Could not proxy path.{q}", q);
                return new ServerErrorResult();
            }
        }

        [HttpGet("LandingPageImage"), HttpHead("LandingPageImage")]
        public async Task<IActionResult> GetLandingPage() =>
            await GetFileAsync(await db.Stations
                .Include(s => s.File)
                .Include(s => s.Transform)
                    .ThenInclude(t => t.Scenario)
                        .ThenInclude(scn => scn.ScenarioGroup)
                .Where(s => s.Transform.Scenario.ScenarioGroup.Name == "Landing Page"
                    && s.Transform.Scenario.StartStationId == s.TransformId
                    && s.Transform.Scenario.Published == true)
                .OrderByDescending(s => s.Transform.Scenario.Version)
                .Select(s => s.File.Id)
                .FirstOrDefaultAsync());

        [HttpGet("menu")]
        public IActionResult GetMenu() =>
            new ObjectResult(db.GetMenu(CurrentUser.OrganizationID, CurrentUser.IsAdmin));

        [HttpGet("scenario/{scenarioID}"),
            HttpHead("scenario/{scenarioID}")]
        public async Task<IActionResult> GetScenario(int scenarioID) =>
            new ObjectResult(await db.GetFullScenarioOutputAsync(CurrentUser.VisibleOrganizationID, scenarioID));
    }
}
