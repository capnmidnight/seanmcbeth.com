using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public abstract class AbstractScenarioFileAsset : AbstractFileAsset
    {
        public int Key { get; }
        public int ScenarioID { get; }
        public int TransformID { get; }

        [JsonConstructor]
        protected AbstractScenarioFileAsset(
            int fileID,
            string fileName,
            string filePath,
            string fileTagString,
            string mediaType,
            string trueMediaType,
            string copyright,
            DateTime copyrightDate,
            int key,
            int scenarioID,
            int transformID)
            : base(
                  fileID,
                  fileName,
                  filePath,
                  fileTagString,
                  mediaType,
                  trueMediaType,
                  copyright,
                  copyrightDate)
        {
            Key = key;
            ScenarioID = scenarioID;
            TransformID = transformID;
        }

        protected AbstractScenarioFileAsset(ScenarioSnapshot scenario, IAsset asset)
            : base(asset)
        {
            Key = asset.Id;
            ScenarioID = scenario.Id;
            TransformID = asset.TransformId;
        }

        protected AbstractScenarioFileAsset(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            Key = info.GetInt32(nameof(Key));
            ScenarioID = info.GetInt32(nameof(ScenarioID));
            TransformID = info.GetInt32(nameof(TransformID));
        }
    }
}