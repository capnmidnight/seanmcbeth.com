using Juniper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Numerics;
using System.Text;
using System.Text.Encodings.Web;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class TextsModel : DbPageModel
    {
        public TextsModel(YarrowContext db)
            : base(db)
        {
        }

        public async Task<IActionResult> OnPostCreateAsync(int scenarioID, [FromBody] TextCreateInput input)
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

            if (contentType != MediaType.Text_Plain)
            {
                return new BadRequestObjectResult("Error uploading text: image format must be TXT.");
            }

            var matrix = Matrix4x4.Multiply(
                    Matrix4x4.CreateTranslation(0, 1.75f, -2),
                    parent.Matrix.ToSystemMatrix4x4());

            var text = new Text
            {
                File = file,
                IsCallout = false,
                AlwaysVisible = false,
                Transform = new Transform
                {
                    Scenario = scenario,
                    ParentTransform = parent,
                    Name = "text-" + file.Name,
                    Matrix = matrix.ToArray()
                }
            };

            await Database.Texts.AddAsync(text);

            await Database.SaveChangesAsync();

            return new ObjectResult(new TextCreateOutput(text));
        }

        public async Task<IActionResult> OnPostUpdateAsync(int scenarioID, [FromBody] TextUpdateInput input)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var text = await Database.Texts
                .Where(s => s.Id == input.ID)
                .Include(s => s.File)
                    .ThenInclude(f => f.FileContent)
                .FirstOrDefaultAsync();

            if (text is null)
            {
                return BadRequest();
            }

            text.IsCallout = input.IsCallout;
            text.AlwaysVisible = input.AlwaysVisible;
            text.File.Name = input.FileName;
            if (input.Text is not null)
            {
                text.File.FileContent.Data = Encoding.UTF8.GetBytes(input.Text);
                text.File.Size = text.File.FileContent.Data.Length;
            }

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] int textID)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var text = await Database.Texts
                .Where(t => t.Id == textID)
                .FirstOrDefaultAsync();

            if (text is null)
            {
                return BadRequest();
            }

            await Database.DeleteTransformTree(scenario, text.TransformId);

            return new OkResult();
        }
    }
}
