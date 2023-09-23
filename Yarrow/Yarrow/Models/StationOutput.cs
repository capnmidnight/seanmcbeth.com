using Juniper.World.GIS;

using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class StationOutput : AbstractScenarioFileAsset
    {
        public string Zone { get; }
        public string Label { get; }
        public float[] Rotation { get; }
        public LatLngPoint Location { get; }

        [JsonConstructor]
        public StationOutput(
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
            string zone,
            string label,
            float[] rotation,
            LatLngPoint location)
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
            Zone = zone;
            Label = label;
            Rotation = rotation;
            Location = location;
        }

        public StationOutput(Scenario scenario, Station s)
            : base(scenario, s)
        {
            Location = new LatLngPoint(s.Latitude, s.Longitude, s.Altitude);
            Rotation = s.Rotation;
            Zone = s.Zone ?? "";
            Label = s.Label ?? "";
        }

        public StationOutput(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            Zone = info.GetString(nameof(Zone));
            Label = info.GetString(nameof(Label));
            Rotation = info.GetValue<float[]>(nameof(Rotation));
            Location = info.GetValue<LatLngPoint>(nameof(Location));
        }
    }
}
