using Juniper;

using System.Net;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ReportSession : Visit
    {
        public const string EXPLORE_ALONE = "explore";
        public const string SESSION_CONNECT = "connect";
        public const string SESSION_QUIT = "quitting";
        public const string SCENARIO_START = "start scenario";
        public const string SCENARIO_LEFT = "leave scenario";
        public const string STATION_SHOWN = "show station";
        public const string STATION_LEFT = "leave station";
        public const string AUDIO_PLAYED = "play audio";
        public const string AUDIO_STOPPED = "stop audio";
        public const string VIDEO_PLAYED = "play video";
        public const string VIDEO_VIEWED = "video viewed";
        public const string VIDEO_STOPPED = "stop video";
        public const string SIGN_EXPANDED = "expand sign";
        public const string SIGN_PAGE_LOADED = "view sign page";
        public const string SIGN_VIEWED = "sign viewed";
        public const string TEXT_EXPANDED = "expand text";
        public const string TEXT_VIEWED = "text viewed";
        public const string MODEL_VIEWED = "model viewed";

        private readonly string meetingID;
        public string MeetingID => meetingID;

        private readonly string meetingName;
        public string MeetingName => meetingName;

        private readonly string userType;
        public string UserType => userType;

        private readonly Report report;
        public bool IsValid => report?.Logs?.Any() == true;

        public IPAddress FromAddress => report?.Logs?.FirstOrDefault()?.FromAddress;

        public string UserID => report?.UserId;
        public string UserName => report?.User?.User?.UserName;

        public string DisplayName => UserName
            ?? MeetingName
            ?? FromAddress?.ToString();

        public bool QuitGracefully { get; } = false;
        public bool IsAlone { get; } = false;

        private readonly Dictionary<int, ReportScenario> scenarios = new();
        public IEnumerable<ReportScenario> Scenarios => scenarios.Values;

        public List<Log> AdditionalLogs { get; } = new List<Log>();

        private readonly Dictionary<string, IEnumerable<Log>> logsByType = new();

        public ReportSession(Report report, Dictionary<string, UserOutput> userProfiles)
            : base(report)
        {
            this.report = report;
            if (IsValid)
            {
                var logs = report.Logs;

                logsByType = logs
                        .GroupBy(g => g.Key)
                        .ToDictionary(g => g.Key, g => g.AsEnumerable());

                // Find the connection parameters: display name and meeting ID.
                (meetingName, meetingID, userType) = logsByType.PopKey(SESSION_CONNECT, (logs) =>
                    logs.First().GetTeleconfParams());

                userType ??= userProfiles.Get(UserID)?.UserType;

                IsAlone = logsByType.Remove(EXPLORE_ALONE);

                // I don't now if this is useful, but I'd like to see if people
                // use the button.
                QuitGracefully = logsByType.Remove(SESSION_QUIT);
            }
        }

        public async Task LoadScenariosAsync(YarrowContext db)
        {

            // Find the scenarios that were viewed.
            await logsByType.PopKey(SCENARIO_START, async (logs) =>
            {
                foreach (var log in logs)
                {
                    if (!log.TryGetID(out var scenarioID))
                    {
                        AdditionalLogs.Add(log);
                    }
                    else
                    {
                        var report = scenarios.Get(scenarioID);
                        if (report is null)
                        {
                            var scenario = await db.GetFullScenarioOutputAsync(null, scenarioID);
                            scenarios.Add(scenarioID, report = new ReportScenario(scenario));
                        }

                        report.Visits.Start(log.CreatedOn, End);
                    }
                }
            });

            // Find when the scenarios were left.
            logsByType.PopKey(SCENARIO_LEFT, (logs) =>
            {
                foreach (var log in logs)
                {
                    if (!log.TryGetID(out var scenarioID))
                    {
                        AdditionalLogs.Add(log);
                    }
                    else if (!scenarios.ContainsKey(scenarioID))
                    {
                        AdditionalLogs.Add(log);
                    }
                    else
                    {
                        var scenario = scenarios[scenarioID];
                        if (!scenario.Visits.End(log.CreatedOn))
                        {
                            AdditionalLogs.Add(log);
                        }
                    }
                }
            });

            var allScenarios = scenarios.Values;

            var halfTimeRangeTypes = new Dictionary<string, Func<ReportScenario, int, DateTime, bool>>
            {
                { STATION_SHOWN, (scenario, id, time) => scenario.StartStationReport(id, time, End) },
                { STATION_LEFT, (scenario, id, time) => scenario.EndStationReport(id, time) },
                { AUDIO_PLAYED, (scenario, id, time) => scenario.StartAudioReport(id, time) },
                { AUDIO_STOPPED, (scenario, id, time) => scenario.EndAudioReport(id, time) },
                { VIDEO_PLAYED, (scenario, id, time) => scenario.StartVideoReport(id, time) },
                { VIDEO_STOPPED, (scenario, id, time) => scenario.EndVideoReport(id, time) },
                { SIGN_EXPANDED, (scenario, id, time) => scenario.MakeSignExpandedReport(id, time) },
                { TEXT_EXPANDED, (scenario, id, time) => scenario.MakeTextExpandedReport(id, time) }
            };

            foreach (var (key, func) in halfTimeRangeTypes)
            {
                logsByType.PopKey(key, (logs) =>
                {
                    foreach (var log in logs)
                    {
                        if (!log.TryGetID(out var id))
                        {
                            AdditionalLogs.Add(log);
                        }
                        else
                        {
                            var found = false;
                            foreach (var scenario in allScenarios)
                            {
                                if (func(scenario, id, log.CreatedOn))
                                {
                                    found = true;
                                    break;
                                }
                            }

                            if (!found)
                            {
                                AdditionalLogs.Add(log);
                            }
                        }
                    }
                });
            }

            var durationTypes = new Dictionary<string, Func<ReportScenario, int, DateTime, double, bool>>
            {
                { SIGN_VIEWED, (scenario, id, start, duration) => scenario.MakeSignViewedReport(id, start, duration) },
                { VIDEO_VIEWED, (scenario, id, start, duration) => scenario.MakeVideoViewedReport(id, start, duration) },
                { TEXT_VIEWED, (scenario, id, start, duration) => scenario.MakeTextViewedReport(id, start, duration) },
                { MODEL_VIEWED, (scenario, id, start, duration) => scenario.MakeModelViewedReport(id, start, duration) }
            };

            foreach (var (key, func) in durationTypes)
            {
                logsByType.PopKey(key, (logs) =>
                {
                    foreach (var log in logs)
                    {
                        if (!log.TryGetIDAndDuration(out var id, out var duration))
                        {
                            AdditionalLogs.Add(log);
                        }
                        else
                        {
                            var found = false;
                            foreach (var scenario in allScenarios)
                            {
                                if (func(scenario, id, log.CreatedOn, duration))
                                {
                                    found = true;
                                    break;
                                }
                            }

                            if (!found)
                            {
                                AdditionalLogs.Add(log);
                            }
                        }
                    }
                });
            }

            logsByType.PopKey(SIGN_PAGE_LOADED, (logs) =>
            {
                foreach (var log in logs)
                {
                    if (!log.TryGetIDAndPage(out var id, out var page))
                    {
                        AdditionalLogs.Add(log);
                    }
                    else
                    {
                        var found = false;
                        foreach (var scenario in allScenarios)
                        {
                            if (scenario.RecordSignPageLoaded(id, log.CreatedOn, page))
                            {
                                found = true;
                                break;
                            }
                        }

                        if (!found)
                        {
                            AdditionalLogs.Add(log);
                        }
                    }
                }
            });

            foreach (var log in logsByType.Values.SelectMany(Always.Identity))
            {
                AdditionalLogs.Add(log);
            }

            AdditionalLogs.Sort((a, b) => a.Id.CompareTo(b.Id));
        }
    }
}
