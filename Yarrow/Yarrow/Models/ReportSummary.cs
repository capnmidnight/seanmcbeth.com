using System.Net;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ReportSummary : Visit
    {
        private readonly Report report;
        private readonly Dictionary<int, ScenarioSnapshot> scenarios;

        public int ReportID => report.Id;

        public string UserId => report.UserId;

        public string UserName => report.User?.User?.UserName;

        private IPAddress fromAddress;
        public IPAddress FromAddress =>
            fromAddress ??= report.Logs
                .FirstOrDefault()
                ?.FromAddress;

        public string DisplayName => UserName
            ?? MeetingName
            ?? FromAddress?.ToString();

        public DateTime Timestamp => report.CreatedOn;

        public IEnumerable<Log> Logs => report.Logs;

        private string meetingName = null;
        public string MeetingName =>
            meetingName ??= (from l in report.Logs
                where l.Key == ReportSession.SESSION_CONNECT
                let session = l.GetTeleconfParams()
                let userName = session.userName
                where userName is not null
                select userName)
                .FirstOrDefault();

        private IEnumerable<ScenarioSnapshot> visitedScenarios;
        public IEnumerable<ScenarioSnapshot> Scenarios =>
            visitedScenarios ??= from l in report.Logs
                where l.Key == ReportSession.SCENARIO_START
                let scenarioID = l.GetID()
                where scenarioID is not null
                group scenarioID.Value by scenarioID.Value into g
                let scenario = scenarios.Get(g.Key)
                where scenario is not null
                orderby scenario.ScenarioGroup.Name
                select scenario;

        public ReportSummary(Report report, Dictionary<int, ScenarioSnapshot> scenarios)
            : base(report)
        {
            this.report = report;
            this.scenarios = scenarios;
        }
    }
}
