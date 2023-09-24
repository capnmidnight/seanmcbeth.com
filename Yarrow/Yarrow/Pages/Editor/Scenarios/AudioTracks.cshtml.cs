using Juniper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Numerics;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class AudioTracksModel : DbPageModel
    {
        public AudioTracksModel(YarrowContext db)
            : base(db)
        {
        }

        public async Task<IActionResult> OnPostCreateAsync(int scenarioID, [FromBody] AudioTrackCreateInput input)
        {
            var scenario = await Database.ScenariosSnapshots
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

            if (contentType != MediaType.Audio_Mpeg
                && contentType != MediaType.Audio_Webm)
            {
                throw new Exception("Error uploading model: audio format must be MP3 or WEBA.");
            }

            var matrix = Matrix4x4.Multiply(
                Matrix4x4.CreateTranslation(0, 1.75f, -2),
                parent.Matrix.ToSystemMatrix4x4());

            var audioTrack = new AudioTrack
            {
                File = file,
                Enabled = true,
                Label = "",
                Effect = "",
                MinDistance = 0.25f,
                MaxDistance = 4f,
                Volume = 1,
                Zone = "",
                Spatialize = input.Spatialize,
                Transform = new Transform
                {
                    Scenario = scenario,
                    ParentTransform = parent,
                    Name = "audio-track-" + file.Name,
                    Matrix = matrix.ToArray()
                }
            };

            await Database.AudioTracks
                .AddAsync(audioTrack);

            await Database.SaveChangesAsync();

            return new ObjectResult(new AudioTrackCreateOutput(audioTrack));
        }

        public async Task<IActionResult> OnPostUpdateAsync(int scenarioID, [FromBody] AudioTrackUpdateInput input)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var audioTrack = await Database.AudioTracks
                .Include(at => at.File)
                .SingleOrDefaultAsync(at => at.Id == input.ID);

            if (audioTrack is null)
            {
                return NotFound();
            }

            audioTrack.Effect = input.Effect;
            audioTrack.MinDistance = input.MinDistance;
            audioTrack.MaxDistance = input.MaxDistance;
            audioTrack.Volume = input.Volume;
            audioTrack.Zone = input.Zone ?? "";
            audioTrack.Label = input.Label ?? "";
            audioTrack.Enabled = input.Enabled;
            audioTrack.File.Name = input.FileName;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] int audioTrackID)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var audioTrack = await Database.AudioTracks
                .Where(at => at.Id == audioTrackID)
                .FirstOrDefaultAsync();

            if (audioTrack is null)
            {
                return BadRequest();
            }

            await Database.DeleteTransformTree(scenario, audioTrack.TransformId);

            return new OkResult();
        }
    }
}
