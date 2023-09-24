using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class TransformsModel : DbPageModel
    {
        public TransformsModel(YarrowContext db)
            : base(db)
        {
        }

        public async Task<IActionResult> OnPostCreateAsync(int scenarioID, [FromBody] TransformInput input)
        {
            var transform = new Transform
            {
                ScenarioId = scenarioID,
                Name = input.Name,
                Matrix = input.Matrix,
                ParentTransformId = input.ParentTransformID
            };

            await Database.Transforms
                .AddAsync(transform);

            await Database.SaveChangesAsync();

            return new ObjectResult(new TransformOutput(transform));
        }

        public async Task<IActionResult> OnPostMoveAsync(int scenarioID, [FromBody] TransformMoveInput input)
        {
            var transform = await Database.Transforms
                .SingleAsync(t => t.Id == input.TransformID
                    && t.ScenarioId == scenarioID);

            transform.Matrix = input.Matrix;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] int transformID)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            await Database.DeleteTransformTree(scenario, transformID);

            return new OkResult();
        }
    }
}
