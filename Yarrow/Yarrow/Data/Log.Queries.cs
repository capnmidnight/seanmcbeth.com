using Microsoft.EntityFrameworkCore;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public async Task<int> LogActivity(HttpRequest request, string userID, LogInput log)
        {
            var report = await Reports.SingleOrDefaultAsync(r => r.Id == log.ReportID)
                ?? new Report
                {
                    UserId = userID
                };
            var address = request.HttpContext.Connection.RemoteIpAddress;
            using var entity = new Log
            {
                FromAddress = address,
                UserId = userID,
                Report = report,
                Key = log.Key,
                Value = log.Value
            };
            await Logs.AddAsync(entity);
            await SaveChangesAsync();
            return report.Id;
        }

        public async Task<string> WithLogs(string userID, int[] logIDs, HttpResponse response, Func<IQueryable<Log>, Task<string>> act)
        {
            if (logIDs is null)
            {
                throw new InvalidOperationException("Invalid form submission");
            }

            if (logIDs.Any(x => x == 0))
            {
                throw new InvalidOperationException("Invalid start/end IDs");
            }

            var logs = Logs
                .Where(l => (userID == null || l.UserId == userID)
                    && logIDs.Contains(l.Id));

            if (logs.Empty())
            {
                throw new FileNotFoundException("No logs found");
            }

            response.RegisterForDispose(logs);

            return await act(logs);
        }

        public async Task<string> CreateReportAsync(string userID, IEnumerable<Log> logs)
        {
            var report = new Report
            {
                UserId = userID
            };

            await Reports.AddAsync(report);
            foreach (var log in logs)
            {
                log.Report = report;
            }

            await SaveChangesAsync();

            return $"redirect:~/Editor/Reports/Detail/{report.Id}";
        }

        public async Task<string> DeleteLogsAsync(IEnumerable<Log> logs)
        {
            Logs.RemoveRange(logs);
            await SaveChangesAsync();
            return "Logs deleted";
        }
    }
}
