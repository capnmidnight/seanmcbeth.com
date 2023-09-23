using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class StationConnectionOutput
    {
        public int FromStationID { get; }
        public int ToStationID { get; }
        public int? TransformID { get; }
        public string Label { get; }

        [JsonConstructor]
        public StationConnectionOutput(int fromStationID, int toStationID, int? transformID, string label)
        {
            FromStationID = fromStationID;
            ToStationID = toStationID;
            TransformID = transformID;
            Label = label;
        }

        public StationConnectionOutput(StationConnection stc)
            : this(
                  stc.FromStationId,
                  stc.ToStationId,
                  stc.TransformId,
                  stc.Label)
        {
        }

        public StationConnectionOutput(SerializationInfo info, StreamingContext context)
            : this(
                  info.GetInt32(nameof(FromStationID)),
                  info.GetInt32(nameof(ToStationID)),
                  info.GetInt32(nameof(TransformID)),
                  info.GetString(nameof(Label)))
        {
        }
    }
}
