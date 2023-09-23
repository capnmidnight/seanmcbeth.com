using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Data;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Controllers.Editor
{
    [ApiController, Authorize, Route("editor/photospheres")]
    public partial class Photospheres : ControllerBase
    {
        private readonly YarrowContext db;

        public Photospheres(YarrowContext db)
        {
            this.db = db;
        }

        [HttpGet]
        public IActionResult GetAll() =>
            new ObjectResult(db.Gsvmetadata
                .Include(g => g.File)
                .Select(g => new PhotosphereMetadata(g)));

        [HttpGet("{fileID:int}")]
        public async Task<IActionResult> Get(int fileID) =>
            new ObjectResult(await db.Gsvmetadata
                .Include(g => g.File)
                .Where(g => g.FileId == fileID)
                .Select(g => new PhotosphereMetadata(g))
                .FirstOrDefaultAsync());

        [HttpGet("search/{pano}")]
        public async Task<IActionResult> Search(string pano) =>
            new ObjectResult(await db.Gsvmetadata
                .Include(g => g.File)
                .Where(g => g.Pano == pano)
                .Select(g => new PhotosphereMetadata(g))
                .FirstOrDefaultAsync());

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromForm] PhotosphereInput input) =>
            new ObjectResult(await db
                .SavePhotosphereAsync(
                    input.FormFile,
                    input.Pano,
                    input.Latitude,
                    input.Longitude,
                    input.Copyright,
                    input.Date?.ToDateOnly()));

        [HttpPost("create/{fileID:int}")]
        public async Task<IActionResult> Update(int fileID, [FromForm] PhotosphereInput input) =>
            new ObjectResult(await db.SavePhotosphereAsync(
                input.FormFile,
                input.Pano,
                input.Latitude,
                input.Longitude,
                input.Copyright,
                input.Date?.ToDateOnly(),
                fileID));
    }
}