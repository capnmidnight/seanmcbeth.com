namespace Yarrow.Models
{
    public class ReportScenario
    {
        public ScenarioOutputFull Scenario { get; }

        public int? ScenarioID => Scenario?.ID;

        public string Language => Scenario?.LanguageName;
        public string Name => Scenario?.Name;

        private readonly Dictionary<int, TransformOutput> transforms = new();
        private readonly Dictionary<int, ReportStation> stations = new();

        private readonly Dictionary<int, SignOutput> signs = new();
        private readonly Dictionary<int, AudioTrackOutput> audios = new();
        private readonly Dictionary<int, VideoClipOutput> videos = new();
        private readonly Dictionary<int, TextOutput> texts = new();
        private readonly Dictionary<int, ModelOutput> models = new();

        public int StationCount => stations.Count;
        public IEnumerable<ReportStation> VisitedStations => stations.Values.Where(s => s.Visits.Count > 0);
        public IEnumerable<ReportStation> UnvisitedStations => stations.Values.Where(s => s.Visits.Count == 0);
        public List<Visit> Visits { get; } = new();
        public TimeSpan Duration => Visits.Sum(v => v.Duration);

        public ReportScenario(ScenarioOutputFull scenario)
        {
            Scenario = scenario;
            foreach (var transform in scenario.Transforms)
            {
                transforms.Add(transform.ID, transform);
            }

            foreach (var station in scenario.Stations)
            {
                stations.Add(station.TransformID, new ReportStation(station));
            }

            foreach (var sign in scenario.Signs)
            {
                signs.Add(sign.TransformID, sign);
                var station = GetContainingStation(sign);
                station?.AddSign(sign);
            }

            foreach (var audio in scenario.AudioTracks)
            {
                audios.Add(audio.TransformID, audio);
                var station = GetContainingStation(audio);
                station?.AddAudio(audio);
            }

            foreach (var video in scenario.VideoClips)
            {
                videos.Add(video.TransformID, video);
                var station = GetContainingStation(video);
                station?.AddVideo(video);
            }

            foreach(var text in scenario.Texts)
            {
                texts.Add(text.TransformID, text);
                var station = GetContainingStation(text); ;
                station?.AddText(text);
            }

            foreach (var model in scenario.Models)
            {
                models.Add(model.TransformID, model);
                var station = GetContainingStation(model);
                station?.AddModel(model);
            }

            if (scenario.StartStationID is not null
                && stations.ContainsKey(scenario.StartStationID.Value))
            {
                var connections = scenario.Connections
                    .Where(c => stations.ContainsKey(c.FromStationID)
                        && stations.ContainsKey(c.ToStationID))
                    .GroupBy(c => c.FromStationID)
                    .ToDictionary(
                        c => stations[c.Key],
                        c => c.Select(s => stations[s.ToStationID])
                              .ToList());

                var visited = new HashSet<ReportStation>();
                var toVisit = new Queue<ReportStation>{
                    stations[scenario.StartStationID.Value]
                };
                while (toVisit.Count > 0)
                {
                    var here = toVisit.Dequeue();
                    if (!visited.Contains(here))
                    {
                        visited.Add(here);
                        if (connections.ContainsKey(here))
                        {
                            toVisit.AddRange(connections[here]);
                        }
                    }
                }

                var toRemove = stations
                    .Where(kv => !visited.Contains(kv.Value))
                    .Select(kv => kv.Key);
                foreach (var key in toRemove)
                {
                    stations.Remove(key);
                }
            }
        }


        private ReportStation GetContainingStation(AbstractScenarioFileAsset asset)
        {
            var here = asset.TransformID;
            while (transforms.ContainsKey(here))
            {
                if (stations.ContainsKey(here))
                {
                    return stations[here];
                }

                here = transforms[here].ParentTransformID;
            }

            return null;
        }

        public bool StartStationReport(int stationID, DateTime start, DateTime end)
        {
            if (!stations.ContainsKey(stationID))
            {
                return false;
            }

            var station = stations[stationID];
            station.StartVisit(start, end);

            return true;
        }

        public bool EndStationReport(int stationID, DateTime end)
        {
            if (!stations.ContainsKey(stationID))
            {
                return false;
            }

            var station = stations[stationID];
            station.EndVisit(end);

            return true;
        }

        private bool Report<ValueT>(Dictionary<int, ValueT> values, int id, Func<ReportStation, ValueT, bool> startReport) where ValueT : AbstractScenarioFileAsset
        {
            if (!values.ContainsKey(id))
            {
                return false;
            }

            var value = values[id];
            var station = GetContainingStation(value);
            if (station is null)
            {
                return false;
            }

            return startReport(station, value);
        }

        public bool StartAudioReport(int audioID, DateTime start) =>
            Report(audios, audioID, (station, audio) =>
                station.StartAudioListen(audio, start));

        public bool EndAudioReport(int audioID, DateTime end) =>
            Report(audios, audioID, (station, audio) =>
                station.EndAudioListen(audio, end));

        public bool StartVideoReport(int videoID, DateTime start) =>
            Report(videos, videoID, (station, video) =>
                station.StartVideoListen(video, start));

        public bool EndVideoReport(int videoID, DateTime end) =>
            Report(videos, videoID, (station, video) =>
                station.EndVideoListen(video, end));

        public bool MakeSignExpandedReport(int signID, DateTime time) =>
            Report(signs, signID, (station, sign) =>
                station.ExpandSign(sign, time));

        public bool MakeTextExpandedReport(int textID, DateTime time) =>
            Report(texts, textID, (station, text) =>
                station.ExpandText(text, time));

        public bool MakeSignViewedReport(int signID, DateTime start, double duration) =>
            Report(signs, signID, (station, sign) =>
                station.ViewSign(sign, start, duration));

        public bool MakeVideoViewedReport(int videoID, DateTime start, double duration) =>
            Report(videos, videoID, (station, video) =>
                station.ViewVideo(video, start, duration));

        public bool MakeTextViewedReport(int textID, DateTime start, double duration) =>
            Report(texts, textID, (station, text) =>
                station.ViewText(text, start, duration));

        public bool MakeModelViewedReport(int modelID, DateTime start, double duration) =>
            Report(models, modelID, (station, model) =>
                station.ViewModel(model, start, duration));

        public bool RecordSignPageLoaded(int signID, DateTime time, int page) =>
            Report(signs, signID, (station, sign) =>
                station.LoadSignPage(sign, time, page));
    }
}
