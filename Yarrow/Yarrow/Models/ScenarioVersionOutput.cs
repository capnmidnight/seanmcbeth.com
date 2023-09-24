using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ScenarioVersionOutput
    {
        public int ID { get; set; }
        public int Version { get; }
        public bool Published { get; }

        [JsonConstructor]
        public ScenarioVersionOutput(
            int id,
            int version,
            bool published)
        {
            ID = id;
            Version = version;
            Published = published;
        }

        public ScenarioVersionOutput(ScenarioSnapshot scn)
            : this(
                  scn.Id,
                  scn.Version,
                  scn.Published)
        {
        }

        public ScenarioVersionOutput(SerializationInfo info, StreamingContext context)
            : this(
                  info.GetInt32(nameof(ID)),
                  info.GetInt32(nameof(Version)),
                  info.GetBoolean(nameof(Published)))
        {
        }
    }
}