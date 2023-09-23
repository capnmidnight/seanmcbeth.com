using Yarrow.Data;

namespace Yarrow.Models
{
    public class AudioTrackCreateOutput
    {
        public AudioTrackOutput AudioTrack { get; }
        public TransformOutput Transform { get; }
        public AudioTrackCreateOutput(AudioTrack audioTrack)
        {
            AudioTrack = new AudioTrackOutput(audioTrack.Transform.Scenario, audioTrack);
            Transform = new TransformOutput(audioTrack.Transform);
        }
    }
}
