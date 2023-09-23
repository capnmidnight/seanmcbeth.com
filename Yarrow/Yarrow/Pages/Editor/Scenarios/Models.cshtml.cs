using Juniper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Numerics;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class ModelsModel : DbPageModel
    {
        public ModelsModel(YarrowContext db)
            : base(db)
        {
        }

        public async Task<IActionResult> OnPostCreateAsync(int scenarioID, [FromBody] ModelCreateInput input)
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

            if (contentType != MediaType.Model_Gltf_Binary
                && contentType != MediaType.Model_Gltf_Json)
            {
                throw new Exception("Error uploading model: model format must be GLTF or GLB.");
            }

            var matrix = Matrix4x4.Multiply(
                    Matrix4x4.CreateTranslation(0, 1.75f, -2),
                    parent.Matrix.ToSystemMatrix4x4());

            var model = new Model
            {
                File = file,
                IsGrabbable = false,
                Transform = new Transform
                {
                    Scenario = scenario,
                    ParentTransform = parent,
                    Name = "Model-" + file.Name,
                    Matrix = matrix.ToArray()
                }
            };

            await Database.Models
                .AddAsync(model);

            await Database.SaveChangesAsync();

            return new ObjectResult(new ModelCreateOutput(model));
        }

        public async Task<IActionResult> OnPostUpdateAsync(int scenarioID, [FromBody] ModelUpdateInput input)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var model = await Database.Models
                .Include(m => m.File)
                .SingleOrDefaultAsync(m => m.Id == input.ID);

            if (model is null)
            {
                return NotFound();
            }

            model.File.Name = input.FileName;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] int modelID)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var model = await Database.Models
                .Where(m => m.Id == modelID)
                .FirstOrDefaultAsync();

            if (model is null)
            {
                return BadRequest();
            }

            await Database.DeleteTransformTree(scenario, model.TransformId);

            return new OkResult();
        }
    }
}
