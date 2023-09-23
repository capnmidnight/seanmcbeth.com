using Juniper.World.GIS;

using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ScenarioOutputFull : ScenarioOutput
    {
        public IEnumerable<ScenarioVersionOutput> Versions { get; }
        public IEnumerable<TransformOutput> Transforms { get; }
        public IEnumerable<StationOutput> Stations { get; }
        public IEnumerable<StationConnectionOutput> Connections { get; }
        public IEnumerable<AudioTrackOutput> AudioTracks { get; }
        public IEnumerable<VideoClipOutput> VideoClips { get; }
        public IEnumerable<TextOutput> Texts { get; }
        public IEnumerable<SignOutput> Signs { get; }
        public IEnumerable<ModelOutput> Models { get; }

        [JsonConstructor]
        public ScenarioOutputFull(
            string name,
            int id,
            int version,
            bool published,
            string languageName,
            float startRotation,
            int? startStationID,
            LatLngPoint origin,
            DateTime createdOn,
            string createdBy,
            DateTime? publishedOn,
            string publishedBy,
            IEnumerable<ScenarioVersionOutput> versions,
            IEnumerable<TransformOutput> transforms,
            IEnumerable<StationOutput> stations,
            IEnumerable<StationConnectionOutput> connections,
            IEnumerable<AudioTrackOutput> audioTracks,
            IEnumerable<VideoClipOutput> videoClips,
            IEnumerable<TextOutput> texts,
            IEnumerable<SignOutput> signs,
            IEnumerable<ModelOutput> models)
            : base(
                name,
                id,
                version,
                published,
                languageName,
                origin,
                startStationID,
                startRotation,
                createdOn,
                createdBy,
                publishedOn,
                publishedBy)
        {
            Versions = versions;
            Transforms = transforms;
            Stations = stations;
            Connections = connections;
            AudioTracks = audioTracks;
            VideoClips = videoClips;
            Texts = texts;
            Signs = signs;
            Models = models;
        }

        public ScenarioOutputFull(
            Scenario scn,
            IEnumerable<ScenarioVersionOutput> versions,
            IEnumerable<TransformOutput> transforms,
            IEnumerable<StationOutput> stations,
            IEnumerable<StationConnectionOutput> connections,
            IEnumerable<AudioTrackOutput> audioTracks,
            IEnumerable<VideoClipOutput> videoClips,
            IEnumerable<TextOutput> texts,
            IEnumerable<SignOutput> signs,
            IEnumerable<ModelOutput> models)
            : base(scn)
        {
            Versions = versions;
            Transforms = transforms;
            Stations = stations;
            Connections = connections;
            AudioTracks = audioTracks;
            VideoClips = videoClips;
            Texts = texts;
            Signs = signs;
            Models = models;
        }

        public ScenarioOutputFull(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
            Versions = info.GetValue<ScenarioVersionOutput[]>(nameof(Versions));
            Transforms = info.GetValue<TransformOutput[]>(nameof(Transforms));
            Stations = info.GetValue<StationOutput[]>(nameof(Stations));
            Connections = info.GetValue<StationConnectionOutput[]>(nameof(Connections));
            AudioTracks = info.GetValue<AudioTrackOutput[]>(nameof(AudioTracks));
            VideoClips = info.GetValue<VideoClipOutput[]>(nameof(VideoClips));
            Texts = info.GetValue<TextOutput[]>(nameof(Texts));
            Signs = info.GetValue<SignOutput[]>(nameof(Signs));
            Models = info.GetValue<ModelOutput[]>(nameof(Models));
        }

        private static readonly Regex disallowedRoomNameCharactersPattern = new("\\W+", RegexOptions.Compiled);
        public string RoomName =>
                disallowedRoomNameCharactersPattern.Replace(
                    string.Join(" ", LanguageName, Name), "_")
                .ToLowerInvariant();
    }
}
