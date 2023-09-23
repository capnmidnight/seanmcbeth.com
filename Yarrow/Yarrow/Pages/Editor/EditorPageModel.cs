using Juniper.HTTP;

using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor
{
    public abstract class EditorPageModel : DbPageModel
    {
        private readonly string resourceName;

        protected IWebHostEnvironment Environment { get; }
        public string StatusMessage { get; private set; }
        public string StatusType { get; private set; }

        public bool IsDev
        {
            get
            {
#if DEBUG
                return Environment.IsDevelopment();
#else
                return false;
#endif
            }
        }

        protected ILogger Logger { get; }

        protected EditorPageModel(YarrowContext db, string resourceName, IWebHostEnvironment env, ILogger logger)
            : base(db)
        {
            this.resourceName = resourceName;
            Environment = env;
            Logger = logger;
        }

        protected async Task<IActionResult> WithStatusReportAsync(string opName, Func<Task<IActionResult>> defaultResponse, Func<Task<string>> act)
        {
            try
            {
                StatusMessage = await act();
                if (StatusMessage is not null)
                {
                    StatusType = "info";
                }

                await Database.SaveChangesAsync();

                if (StatusMessage?.StartsWith("redirect:") == true)
                {
                    return Redirect(StatusMessage[9..]);
                }
            }
            catch(ObjectResultHack obj)
            {
                return new ObjectResult(obj.Value);
            }
            catch (FileNotFoundException)
            {
                return NotFound();
            }
            catch (InvalidOperationException)
            {
                return BadRequest();
            }
            catch (BadHttpRequestException)
            {
                return BadRequest();
            }
            catch (ArgumentException)
            {
                return BadRequest();
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception exp)
            {
                Logger.LogError(exp, "Unhandled exception during operation {resourceName}:{opName}", resourceName, opName);
                StatusType = "danger";
                StatusMessage = $"Failed to {opName} {resourceName}: {exp.Message}.";
            }

            return await defaultResponse();
        }

        protected Task<IActionResult> WithStatusReportAsync(string opName, Func<IActionResult> defaultResponse, Func<Task<string>> act) =>
            WithStatusReportAsync(opName, () => Task.FromResult(defaultResponse()), act);


        protected Task<IActionResult> WithStatusReportAsync(string opName, Func<IActionResult> defaultResponse, Func<string> act) =>
            WithStatusReportAsync(opName, defaultResponse, () => Task.FromResult(act()));

        protected Task<IActionResult> WithStatusReportAsync(string opName, Func<Task<IActionResult>> defaultResponse, Func<string> act) =>
            WithStatusReportAsync(opName, defaultResponse, () => Task.FromResult(act()));
    }
}
