using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public abstract class AbstractMediaAsset : AbstractScenarioFileAsset
    {
        public float Volume { get; }
        public bool Enabled { get; }
        public string Label { get; }

        [JsonConstructor]
        protected AbstractMediaAsset(
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
            string label)
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
                  transformID)
        {
            Volume = volume;
            Enabled = enabled;
            Label = label;
        }

        protected AbstractMediaAsset(Scenario scenario, IMediaAsset asset)
            : base(scenario, asset)
        {
            Volume = asset.Volume;
            Enabled = asset.Enabled == true;
            Label = asset.Label;
        }

        protected AbstractMediaAsset(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            Volume = info.GetSingle(nameof(Volume));
            Enabled = info.GetBoolean(nameof(Enabled));
            Label = info.GetString(nameof(Label));
        }
    }
}