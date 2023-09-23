using Juniper;
using Juniper.Configuration;
using Juniper.World.GIS.Google;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Yarrow.Controllers.Editor
{
    [ApiController, Authorize, Route("editor/google")]
    public class GoogleAPIs : ControllerBase
    {
        private readonly IGoogleMapsStreamingClient gmaps;
        private readonly string key;

        public GoogleAPIs(IConfiguration config, IGoogleMapsStreamingClient gmaps)
        {
            this.gmaps = gmaps;
            key = config.GetGoogleAPIKey();
        }

        [HttpGet("apikey")]
        public IActionResult GetAPIKey()
        {
            return new ObjectResult(key);
        }

        [HttpGet("streetview/metadata/{pano}")]
        public async Task<IActionResult> OnGetMetadataAsync(string pano)
        {
            var stream = await gmaps.GetMetadataStreamAsync(pano);
            return File(stream, MediaType.Application_Json);
        }

        [HttpGet("streetview/image/{pano}/{fovDegrees:int}/{headingDegrees:int}/{pitchDegrees:int}")]
        public async Task<IActionResult> OnGetImageAsync(string pano, int fovDegrees, int headingDegrees, int pitchDegrees)
        {
            var stream = await gmaps.GetImageStreamAsync(pano, fovDegrees, headingDegrees, pitchDegrees);
            return File(stream, MediaType.Image_Jpeg);
        }
    }
}
