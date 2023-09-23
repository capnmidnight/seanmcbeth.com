using Juniper.World.GIS;

using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ScenarioOutput
    {
        public string Name { get; }
        public int ID { get; }
        public string LanguageName { get; }
        public float StartRotation { get; }
        public int? StartStationID { get; }
        public DateTime CreatedOn { get; }
        public string CreatedBy { get; }
        public DateTime? PublishedOn { get; }
        public string PublishedBy { get; }
        public bool Published { get; }
        public int Version { get; }

        public LatLngPoint Origin { get; }

        [JsonConstructor]
        public ScenarioOutput(
            string name,
            int id,
            int version,
            bool published,
            string languageName,
            LatLngPoint origin,
            int? startStationID,
            float startRotation,
            DateTime createdOn,
            string createdBy,
            DateTime? publishedOn,
            string publishedBy)
        {
            Name = name;
            ID = id;
            Version = version;
            Published = published;
            LanguageName = languageName;
            Origin = origin;
            StartStationID = startStationID;
            StartRotation = startRotation;
            CreatedOn = createdOn;
            CreatedBy = createdBy;
            PublishedOn = publishedOn;
            PublishedBy = publishedBy;
        }

        public ScenarioOutput(Scenario scn)
            : this(
                  scn.ScenarioGroup.Name,
                  scn.Id,
                  scn.Version,
                  scn.Published,
                  scn.ScenarioGroup.Language.Name,
                  (scn.OriginLatitude is not null
                && scn.OriginLongitude is not null)
                    ? new(scn.OriginLatitude.Value, scn.OriginLongitude.Value, scn.OriginAltitude ?? 0)
                  : null,
                  scn.StartStationId,
                  scn.StartRotation,
                  scn.Timestamp,
                  scn.CreatedBy?.FullName,
                  scn.PublishedOn,
                  scn.PublishedBy?.FullName)
        {
        }


        public ScenarioOutput(SerializationInfo info, StreamingContext context)
            : this(
                  info.GetString(nameof(Name)),
                  info.GetInt32(nameof(ID)),
                  info.GetInt32(nameof(Version)),
                  info.GetBoolean(nameof(Published)),
                  info.GetString(nameof(LanguageName)),
                  info.GetValue<LatLngPoint>(nameof(Origin)),
                  info.GetInt32(nameof(StartStationID)),
                  info.GetSingle(nameof(StartRotation)),
                  info.GetDateTime(nameof(CreatedOn)),
                  info.GetString(nameof(CreatedBy)),
                  info.GetDateTime(nameof(PublishedOn)),
                  info.GetString(nameof(PublishedBy)))
        {
        }
    }
}
