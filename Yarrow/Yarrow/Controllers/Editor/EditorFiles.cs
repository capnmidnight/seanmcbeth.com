using Juniper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

using System.Data;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Controllers.Editor
{
    [ApiController, Authorize, Route("editor/files")]
    public partial class EditorFiles : ControllerBase
    {
        private readonly YarrowContext db;
        private readonly IWebHostEnvironment env;
        private readonly ILogger logger;

        public EditorFiles(YarrowContext db, IWebHostEnvironment env, ILogger<EditorFiles> logger)
        {
            this.db = db;
            this.env = env;
            this.logger = logger;
        }

        [HttpGet("download/{fileID}")]
        public Task<IActionResult> GetFile(int fileID)
        {
            var range = Request.Headers[HeaderNames.Range]
                .FirstOrDefault();

            return db.GetFileContent(fileID, range);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateFile([FromForm] FileCreateInput fileUpload)
        {
            var file = await db.CreateFileAsync(fileUpload);
            return new ObjectResult(new FileOutput(file));
        }

        [HttpPost("{fileID}")]
        public async Task<IActionResult> UpdateFile(int fileID, [FromForm] FileCreateInput fileUpload)
        {
            var file = await db.SaveFileAsync(
                fileUpload.FormFile,
                null,
                fileUpload.TagString,
                fileUpload.Copyright,
                fileUpload.CopyrightDate.ToDateOnly(),
                fileID);

            await db.SaveChangesAsync();

            return new ObjectResult(new FileOutput(file));
        }

        [HttpGet("tags")]
        public IActionResult GetTags() =>
            new ObjectResult(db.GetTags());

        public class SearchInput
        {
            public string TypeFilter { get; set; }
            public string TagFilter { get; set; }
        }

        [HttpPost("search")]
        public IActionResult Search([FromBody] SearchInput input)
        {
            if (input is null)
            {
                return new BadRequestResult();
            }

            var filterTags = (input.TagFilter ?? "").ToLowerInvariant()
                .Split(",")
                .Select(t => t.Trim())
                .Where(t => t.Length > 0)
                .Distinct()
                .ToArray();

            var filterTypes = (input.TypeFilter ?? "")
                .Split(",")
                .Select(t => t.Trim())
                .Where(t => t.Length > 0)
                .Distinct()
                .SelectMany(MediaType.GuessByExtension)
                .ToArray();

            var files = db.Files
                .Include(f => f.Tags)
                .Where(f => filterTags.Length == 0
                        || f.Tags.Any(t => filterTags.Contains(t.Name)))
                .AsEnumerable()
                .Where(f => filterTypes.Length == 0
                        || filterTypes.Any(t => t.Matches(f.AltMime ?? f.Mime)))
                .Select(f => new FileOutput(f));

            return new ObjectResult(files);
        }
    }
}