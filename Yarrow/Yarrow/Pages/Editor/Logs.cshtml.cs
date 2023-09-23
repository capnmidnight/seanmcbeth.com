using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;

namespace Yarrow.Pages.Editor
{
    public class LogsModel : EditorPageModel
    {
        public Log[] Logs { get; private set; }

        [BindProperty]
        public bool[] SelectedLog { get; set; }

        public LogsModel(YarrowContext db, IWebHostEnvironment env, ILogger<LogsModel> logger)
            : base(db, "log", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            GetLogs();
            return Page();
        }

        private void GetLogs()
        {
            Logs = Database.Logs
                .Include(l => l.User)
                    .ThenInclude(up => up.User)
                .Where(l => l.ReportId == null)
                .OrderBy(l => l.FromAddress)
                    .ThenBy(l => l.Id)
                .ToArray();

            Response.RegisterForDispose(Logs);
        }

        private Task<IActionResult> WithSelectedLogsAsync(string opName, Func<IQueryable<Log>, Task<string>> act) =>
            WithStatusReportAsync(opName, OnGet, () =>
            {
                GetLogs();

                var logIDs = Logs.Where((l, i) => SelectedLog[i])
                    .Select(l => l.Id)
                    .ToArray();

                if (logIDs.Length == 0)
                {
                    throw new FileNotFoundException();
                }

                return Database.WithLogs(null, logIDs, Response, act);
            });

        public Task<IActionResult> OnPostCreateReportAsync() =>
            WithSelectedLogsAsync("create report for", (logs) =>
                Database.CreateReportAsync(null, logs));

        public Task<IActionResult> OnPostDeleteLogsAsync() =>
            WithSelectedLogsAsync("delete", Database.DeleteLogsAsync);
    }
}
