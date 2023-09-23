using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ModelOutput : AbstractScenarioFileAsset
    {
        public bool IsGrabbable { get; }

        [JsonConstructor]
        public ModelOutput(
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
            bool isGrabbable)
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
            IsGrabbable = isGrabbable;
        }

        public ModelOutput(Scenario scenario, Model m)
            : base(scenario, m)
        {
            IsGrabbable = m.IsGrabbable;
        }

        public ModelOutput(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            IsGrabbable = info.GetBoolean(nameof(IsGrabbable));
        }
    }
}
