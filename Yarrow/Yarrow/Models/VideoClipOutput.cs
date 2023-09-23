using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class VideoClipOutput : AbstractMediaAsset
    {
        public string SphereEncodingName { get; }
        public string StereoLayoutName { get; }

        [JsonConstructor]
        public VideoClipOutput(
            int fileID,
            string fileName,
            string filePath,
            string fileTagString,
            string mediaType,
            string trueMediaType,
            string copyright,
            DateTime? copyrightDate,
            int key,
            int scenarioID,
            int transformID,
            float volume,
            bool enabled,
            string label,
            string sphereEncodingName,
            string stereoLayoutName)
            : base(
                fileID,
                fileName,
                filePath,
                fileTagString,
                mediaType,
                trueMediaType,
                copyright,
                copyrightDate,
                key,
                scenarioID,
                transformID,
                volume,
                enabled,
                label)
        {
            SphereEncodingName = sphereEncodingName;
            StereoLayoutName = stereoLayoutName;
        }

        public VideoClipOutput(Scenario scenario, VideoClip vc)
            : base(scenario, vc)
        {
            SphereEncodingName = vc.SphereEncodingName;
            StereoLayoutName = vc.StereoLayoutName;
        }

        public VideoClipOutput(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            SphereEncodingName = info.GetString(nameof(SphereEncodingName));
            StereoLayoutName = info.GetString(nameof(StereoLayoutName));
        }
    }
}