using Yarrow.Data;

namespace Yarrow.Models
{
    public class VideoClipCreateOutput
    {
        public VideoClipOutput VideoClip { get; }
        public TransformOutput Transform { get; }
        public VideoClipCreateOutput(VideoClip videoClip)
        {
            VideoClip = new VideoClipOutput(videoClip.Transform.Scenario, videoClip);
            Transform = new TransformOutput(videoClip.Transform);
        }
    }
}
