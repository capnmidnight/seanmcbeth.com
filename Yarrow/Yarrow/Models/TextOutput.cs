using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class TextOutput : AbstractScenarioFileAsset
    {
        public bool IsCallout { get; }
        public bool AlwaysVisible { get; }

        public string Text { get; }

        [JsonConstructor]
        public TextOutput(
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
            bool alwaysVisible,
            string text)
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
            Text = text;
        }

        public TextOutput(ScenarioSnapshot scenario, Text t)
            : base(scenario, t)
        {
            IsCallout = t.IsCallout;
            AlwaysVisible = t.AlwaysVisible;
        }

        public TextOutput(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            IsCallout = info.GetBoolean(nameof(IsCallout));
            AlwaysVisible = info.GetBoolean(nameof(AlwaysVisible));
        }
    }
}
