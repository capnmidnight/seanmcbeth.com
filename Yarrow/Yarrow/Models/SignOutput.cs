using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class SignOutput : AbstractScenarioFileAsset
    {
        public bool IsCallout { get; }
        public bool AlwaysVisible { get; }

        [JsonConstructor]
        public SignOutput(
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
            int transformID,
            bool isCallout,
            bool alwaysVisible)
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
            IsCallout = isCallout;
            AlwaysVisible = alwaysVisible;
        }

        public SignOutput(ScenarioSnapshot scenario, Sign s)
            : base(scenario, s)
        {
            IsCallout = s.IsCallout;
            AlwaysVisible = s.AlwaysVisible;
        }

        public SignOutput(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            IsCallout = info.GetBoolean(nameof(IsCallout));
            AlwaysVisible = info.GetBoolean(nameof(AlwaysVisible));
        }
    }
}
