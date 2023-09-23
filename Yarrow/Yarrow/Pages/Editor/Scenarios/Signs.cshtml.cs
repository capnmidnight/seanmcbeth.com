using Juniper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Numerics;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class SignsModel : DbPageModel
    {
        public const int PPI = 50;
        public const int DEMO_DIM = 12;

        public static int DEMO_PX => PPI * DEMO_DIM;

        public SignsModel(YarrowContext db)
            : base(db)
        {
        }

        public async Task<IActionResult> OnPostCreateAsync(int scenarioID, [FromBody] SignCreateInput input)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var parent = await Database.Transforms
                .SingleOrDefaultAsync(t => t.Id == input.ParentTransformID);

            if (parent is null)
            {
                return NotFound();
            }

            var file = await Database.GetFileAsync(input.FileID);

            if (file is null)
            {
                return NotFound();
            }

            var contentType = file.AltMime ?? file.Mime;

            if (contentType != MediaType.Image_Png
                && contentType != MediaType.Image_Jpeg
                && contentType != MediaType.Application_Pdf)
            {
                return new BadRequestObjectResult("Error uploading sign: image format must be PNG, JPEG, or PDF.");
            }

            var perMeter = (float)Juniper.Units.Inches.Meters(1.0 / PPI);
            var size = perMeter * input.ImageWidth;
            var positionMatrix = Matrix4x4.Multiply(
                    Matrix4x4.CreateTranslation(0, 1.75f, -2),
                    parent.Matrix.ToSystemMatrix4x4());
            var matrix = Matrix4x4.Multiply(
                Matrix4x4.CreateScale(size, size, 1),
                positionMatrix);

            var sign = new Sign
            {
                File = file,
                IsCallout = false,
                AlwaysVisible = false,
                Transform = new Transform
                {
                    Scenario = scenario,
                    ParentTransform = parent,
                    Name = "sign-" + file.Name,
                    Matrix = matrix.ToArray()
                }
            };

            await Database.Signs
                .AddAsync(sign);

            await Database.SaveChangesAsync();

            return new ObjectResult(new SignCreateOutput(sign));
        }

        public async Task<IActionResult> OnPostUpdateAsync(int scenarioID, [FromBody] SignUpdateInput input)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var sign = await Database.Signs
                .Where(s => s.Id == input.ID)
                .Include(s => s.File)
                .FirstOrDefaultAsync();

            if (sign is null)
            {
                return BadRequest();
            }

            sign.IsCallout = input.IsCallout;
            sign.AlwaysVisible = input.AlwaysVisible;
            sign.File.Name = input.FileName;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] int signID)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var sign = await Database.Signs
                .Where(s => s.Id == signID)
                .FirstOrDefaultAsync();

            if (sign is null)
            {
                return BadRequest();
            }

            await Database.DeleteTransformTree(scenario, sign.TransformId);

            return new OkResult();
        }
    }
}
