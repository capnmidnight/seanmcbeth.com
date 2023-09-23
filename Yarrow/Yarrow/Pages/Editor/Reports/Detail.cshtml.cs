using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Reports
{
    public class DetailModel : EditorPageModel
    {
        public DetailModel(YarrowContext db, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "report", env, logger)
        {
        }

        public Report Report { get; private set; }
        public ReportSession ReportDetail { get; private set; }
        public Dictionary<string, UserOutput> UserProfiles { get; private set; }

        public HashSet<string> UsersMatchingIP { get; private set; }

        private async Task<string> WithReport(int reportID, Func<Task<string>> act)
        {
            Report = await Database
                .Reports
                .Include(r => r.User)
                    .ThenInclude(u => u.User)
                .Include(r => r.Logs)
                .SingleOrDefaultAsync(r => r.Id == reportID);

            if (Report is null)
            {
                throw new FileNotFoundException();
            }

            if (!CurrentUser.IsAdmin && Report.User.OrganizationID != CurrentUser.OrganizationID)
            {
                throw new UnauthorizedAccessException();
            }

            Response.RegisterForDispose(Report.Logs);

            return await act();
        }

        private Task<string> WithReportDetail(int reportID, Func<Task<string>> act) =>
            WithReport(reportID, async () =>
            {
                UserProfiles = Database.GetFullUsers().ToDictionary(u => u.UserID);
                ReportDetail = new ReportSession(Report, UserProfiles);
                await ReportDetail.LoadScenariosAsync(Database);
                return await act();
            });


        public Task<IActionResult> OnGetAsync([FromRoute] int reportID) =>
            WithStatusReportAsync("Get report", Page, () =>
                WithReportDetail(reportID, () =>
                {
                    if (!CurrentUser.IsManager)
                    {
                        throw new UnauthorizedAccessException();
                    }

                    UsersMatchingIP = Database.Logs
                        .Include(l => l.User)
                            .ThenInclude(u => u.User)
                        .Where(l => l.FromAddress == ReportDetail.FromAddress
                            && l.User != null)
                        .GroupBy(l => l.UserId)
                        .Select(g => g.Key)
                        .ToHashSet();

                    return Task.FromResult<string>(null);
                }));


        public Task<IActionResult> OnPostDeleteReportAsync([FromRoute] int reportID) =>
            WithStatusReportAsync("delete", () => OnGetAsync(reportID), () =>
                WithReport(reportID, async () =>
                {
                    SelectedLog = null;
                    var userID = Report.UserId;
                    foreach (var log in Report.Logs)
                    {
                        log.ReportId = null;
                    }
                    Database.Reports.Remove(Report);
                    await Database.SaveChangesAsync();
                    if (userID is not null)
                    {
                        return $"redirect:~/Editor/Users/Detail/{Report.UserId}";
                    }
                    else
                    {
                        return "redirect:~/Editor/Reports";
                    }
                }));

        [BindProperty]
        public bool[] SelectedLog { get; set; }

        public Task<IActionResult> OnPostDeleteLogsAsync([FromRoute] int reportID) =>
            WithStatusReportAsync("delete logs from", () => OnGetAsync(reportID), () =>
                WithReportDetail(reportID, async () => 
                {
                    var userID = await Database.Logs
                        .Where(l => l.ReportId == reportID)
                        .Select(l => l.UserId)
                        .FirstOrDefaultAsync();

                    var logIDs = ReportDetail.AdditionalLogs.Where((l, i) => SelectedLog[i])
                        .Select(l => l.Id)
                        .ToArray();

                    if (logIDs.Length == 0)
                    {
                        throw new FileNotFoundException();
                    }

                    return await Database.WithLogs(userID, logIDs, Response, Database.DeleteLogsAsync);
                }));

        public Task<IActionResult> OnPostAssignUserAsync([FromRoute] int reportID, [FromForm] UserIDInput input) =>
            WithStatusReportAsync("assign user to", () => OnGetAsync(reportID), async () =>
            {
                SelectedLog = null;
                var report = await Database.Reports
                    .Include(r => r.Logs)
                    .SingleOrDefaultAsync(r => r.Id == reportID);
                Response.RegisterForDispose(report.Logs);

                report.UserId = input.UserID;
                foreach(var log in report.Logs)
                {
                    log.UserId = input.UserID;
                }

                await Database.SaveChangesAsync();
                var userName = await Database
                    .Users
                    .Where(u => u.Id == input.UserID)
                    .Select(u => u.UserName)
                    .SingleOrDefaultAsync();
                if (userName is not null)
                {
                    return $@"User ""{userName}"" assigned";
                }
                else
                {
                    return "User removed";
                }
            });
    }
}
