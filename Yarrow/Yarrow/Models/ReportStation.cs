namespace Yarrow.Models
{
    public class ReportStation : AbstractValueReport<StationOutput>
    {
        public override string Name => string.IsNullOrWhiteSpace(Value.Label)
            ? Value.FileName
            : Value.Label;

        private readonly Dictionary<int, ReportSign> signs = new();
        private readonly Dictionary<int, ReportAudioTrack> audios = new();
        private readonly Dictionary<int, ReportVideoClip> videos = new();
        private readonly Dictionary<int, ReportText> texts = new();
        private readonly Dictionary<int, ReportModel> models = new();
        public List<Visit> Visits { get; } = new();
        public TimeSpan TotalVisitDuration => Visits.Sum(v => v.Duration);

        public IEnumerable<ReportSign> Signs => signs.Values;
        public IEnumerable<ReportAudioTrack> Audios => audios.Values;
        public IEnumerable<ReportVideoClip> Videos => videos.Values;
        public IEnumerable<ReportText> Texts => texts.Values;
        public IEnumerable<ReportModel> Models => models.Values;

        public ReportStation(StationOutput station)
            : base(station)
        {
        }

        public void AddSign(SignOutput sign) =>
            signs.Add(sign.TransformID, new ReportSign(sign));

        public void AddAudio(AudioTrackOutput audio)
        {
            if (!audio.Spatialize)
            {
                audios.Add(audio.TransformID, new ReportAudioTrack(audio));
            }
        }

        public void AddVideo(VideoClipOutput video) =>
            videos.Add(video.TransformID, new ReportVideoClip(video));

        public void AddText(TextOutput text) =>
            texts.Add(text.TransformID, new ReportText(text));

        public void AddModel(ModelOutput model) =>
            models.Add(model.TransformID, new ReportModel(model));

        public void StartVisit(DateTime start, DateTime end) =>
            Visits.Start(start, end);

        public bool EndVisit(DateTime end) =>
            Visits.End(end);

        private bool FindStationVisit<ValueT, ReportT>(
            Dictionary<int, ReportT> reports,
            ValueT value,
            DateTime start,
            Func<ReportT, Visit, bool> makeReport) where ValueT : AbstractScenarioFileAsset
        {
            if (!reports.ContainsKey(value.TransformID))
            {
                return false;
            }

            foreach (var visit in Visits)
            {
                if (visit.Start <= start && start <= visit.End)
                {
                    if (makeReport(reports[value.TransformID], visit))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public bool StartAudioListen(AudioTrackOutput audio, DateTime start) =>
            FindStationVisit(audios, audio, start, (report, visit) =>
                report.StartListen(start, visit.End));

        public bool EndAudioListen(AudioTrackOutput audio, DateTime end) =>
            FindStationVisit(audios, audio, end, (report, _) =>
                report.EndListen(end));

        public bool StartVideoListen(VideoClipOutput video, DateTime start) =>
            FindStationVisit(videos, video, start, (report, visit) =>
                report.StartListen(start, visit.End));

        public bool EndVideoListen(VideoClipOutput video, DateTime end) =>
            FindStationVisit(videos, video, end, (report, _) =>
                report.EndListen(end));

        public bool ExpandSign(SignOutput sign, DateTime time) =>
            FindStationVisit(signs, sign, time, (report, _) =>
                report.ExpandSign());

        public bool ExpandText(TextOutput text, DateTime time) =>
            FindStationVisit(texts, text, time, (report, _) =>
                report.ExpandText());

        public bool ViewSign(SignOutput sign, DateTime start, double duration) =>
            FindStationVisit(signs, sign, start, (report, _) =>
                report.View(start, duration));

        public bool LoadSignPage(SignOutput sign, DateTime time, int page) =>
            FindStationVisit(signs, sign, time, (report, _) =>
                report.LoadPage(page));

        public bool ViewVideo(VideoClipOutput video, DateTime start, double duration) =>
            FindStationVisit(videos, video, start, (report, _) =>
                report.View(start, duration));

        public bool ViewText(TextOutput text, DateTime start, double duration) =>
            FindStationVisit(texts, text, start, (report, _) =>
                report.View(start, duration));

        public bool ViewModel(ModelOutput model, DateTime start, double duration) =>
            FindStationVisit(models, model, start, (report, _) =>
                report.View(start, duration));
    }
}
