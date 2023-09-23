using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class AudioTrackOutput : AbstractMediaAsset
    {
        public string Zone { get; }
        public string Effect { get; }
        public float MinDistance { get; }
        public float MaxDistance { get; }
        public bool Spatialize { get; }

        [JsonConstructor]
        public AudioTrackOutput(
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
            string zone,
            string effect,
            float minDistance,
            float maxDistance,
            bool spatialize)
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
            Zone = zone;
            Effect = effect;
            MinDistance = minDistance;
            MaxDistance = maxDistance;
            Spatialize = spatialize;
        }

        public AudioTrackOutput(Scenario scenario, AudioTrack at)
            : base(scenario, at)
        {
            Zone = at.Zone ?? "";
            Effect = at.Effect;
            MaxDistance = at.MaxDistance;
            MinDistance = at.MinDistance;
            Spatialize = at.Spatialize;
        }

        public AudioTrackOutput(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            Zone = info.GetString(nameof(Zone));
            Effect = info.GetString(nameof(Effect));
            MinDistance = info.GetSingle(nameof(MinDistance));
            MaxDistance = info.GetSingle(nameof(MaxDistance));
            Spatialize = info.GetBoolean(nameof(Spatialize));
        }
    }
}