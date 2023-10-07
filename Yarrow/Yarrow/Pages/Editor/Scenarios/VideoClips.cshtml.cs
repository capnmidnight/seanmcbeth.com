using Juniper;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Numerics;

using Yarrow.Data;
using Yarrow.Models;

using static Juniper.XR.SphereEncoding;
using static Juniper.XR.StereoLayout;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class VideoClipsModel : DbPageModel
    {
        public VideoClipsModel(YarrowContext db)
            : base(db)
        {
        }

        /// <summary>
        /// Handle POST events to create a new Video Clip from a video file already stored in the database.
        /// </summary>
        /// <param name="scenarioID">The ID of the scenario in which to create the Video Clip</param>
        /// <param name="input">The Video Clip parameters</param>
        /// <returns>
        ///     If the scenario does not exist, returns NotFound.
        ///     If the input.ParentTransform does not exist, returns NotFound.
        ///     If the input.File does not exist, returns NotFound.
        ///     If the input.File is not an MPEG, WEBM, or link to a YouTube video, returns BadRequest.
        ///     Otherwise, returns OK with a JSON document describing the created Video Clip.
        /// </returns>
        public async Task<IActionResult> OnPostCreateAsync(int scenarioID, [FromBody] VideoClipCreateInput input)
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

            if (contentType != MediaType.Video_Mp4
                && contentType != MediaType.Video_Mpeg
                && contentType != MediaType.Video_Webm
                && contentType != Options.Video_Vnd_Yarrow_YtDlp_Json)
            {
                return BadRequest("Error uploading model: video format must be MPG or WEBM.");
            }

            var matrix = Matrix4x4.Multiply(
                Matrix4x4.CreateTranslation(0, 1.75f, -2),
                parent.Matrix.ToSystemMatrix4x4());

            var videoClip = new VideoClip
            {
                File = file,
                Volume = 1,
                SphereEncoding = SphereEncodingKind.None,
                StereoLayout = StereoLayoutKind.None,
                Label = "",
                Transform = new Transform
                {
                    Scenario = scenario,
                    ParentTransform = parent,
                    Name = "video-clip-" + file.Name,
                    Matrix = matrix.ToArray()
                }
            };

            await Database.VideoClips
                .AddAsync(videoClip);

            await Database.SaveChangesAsync();

            return new ObjectResult(new VideoClipCreateOutput(videoClip));
        }

        public async Task<IActionResult> OnPostUpdateAsync(int scenarioID, [FromBody] VideoClipUpdateInput input)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var videoClip = await Database.VideoClips
                .Include(v => v.File)
                .SingleOrDefaultAsync(v => v.Id == input.ID);

            if (videoClip is null)
            {
                return NotFound();
            }

            videoClip.Volume = input.Volume;
            videoClip.Label = input.Label ?? "";
            videoClip.Enabled = input.Enabled;
            videoClip.SphereEncoding = input.SphereEncoding;
            videoClip.StereoLayout = input.StereoLayout;
            videoClip.File.Name = input.FileName;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] int videoClipID)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var videoClip = await Database.VideoClips
                .Where(v => v.Id == videoClipID)
                .FirstOrDefaultAsync();

            if (videoClip is null)
            {
                return BadRequest();
            }

            await Database.DeleteTransformTree(scenario, videoClip.TransformId);

            return new OkResult();
        }
    }
}
