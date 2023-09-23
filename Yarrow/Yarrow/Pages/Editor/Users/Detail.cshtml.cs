using Juniper.Data.Identity;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Users
{
    public class DetailModel : EditorPageModel
    {
        private readonly UserManager<IdentityUser> users;
        private readonly RoleManager<IdentityRole> roles;
        private readonly IEmailSender email;
        private readonly IConfiguration config;

        public UserOutput UserProfile { get; private set; }
        public IEnumerable<Scenario> Scenarios { get; private set; }
        public IEnumerable<ReportSummary> Reports { get; private set; }
        public Log[] Logs { get; private set; }
        public IEnumerable<IdentityRole> Roles { get; private set; }
        public IEnumerable<Organization> Organizations { get; private set; }
        public IEnumerable<Room> Rooms { get; private set; }
        public IEnumerable<IdentityUser> Headsets { get; private set; }
        public IEnumerable<IdentityUser> Users { get; private set; }

        public IEnumerable<Language> Languages { get; private set; }

        [BindProperty]
        public bool[] SelectedLog { get; set; }

        public DetailModel(
            YarrowContext db,
            UserManager<IdentityUser> users,
            RoleManager<IdentityRole> roles,
            IEmailSender email,
            IWebHostEnvironment env,
            IConfiguration config,
            ILogger<DetailModel> logger)
            : base(db, "user", env, logger)
        {
            this.users = users;
            this.roles = roles;
            this.email = email;
            this.config = config;
        }

        public async Task<IActionResult> OnGetAsync([FromRoute] string userID)
        {
            if (!CurrentUser.IsManager)
            {
                return Forbid();
            }

            if (string.IsNullOrEmpty(userID))
            {
                return NotFound();
            }

            UserProfile = Database.GetUserProfileWithRoles(userID);

            if (!CurrentUser.IsAdmin && UserProfile.OrganizationID != CurrentUser.OrganizationID)
            {
                return Forbid();
            }

            Reports = await Database.GetReportSummariesAsync(CurrentUser.VisibleOrganizationID, userID);
            Response.RegisterForDispose(Reports.SelectMany(r => r.Logs));

            GetLogs(userID);

            Roles ??= roles.GetRoles(CurrentUser);

            Organizations ??= Database
                .Organizations
                .Where(org => org.Name != "Anonymous")
                .OrderBy(o => o.Name);

            Rooms ??= Database
                .Rooms
                .OrderBy(r => r.Name);

            Headsets = await users.GetUsersInRoleAsync(Role.Headset);
            Users = users.Users
                .AsEnumerable()
                .Where(u => !(users.IsInRoleAsync(u, Role.Headset).Result));

            Scenarios = Database.Scenarios
                .Include(s => s.ScenarioGroup)
                    .ThenInclude(sg => sg.Language)
                .Include(s => s.CreatedBy)
                    .ThenInclude(u => u.User)
                .Include(s => s.PublishedBy)
                    .ThenInclude(u => u.User)
                .Where(s => s.CreatedById == userID
                    || s.PublishedById == userID)
                .OrderBy(s => s.ScenarioGroup.Language.Name)
                .OrderBy(s => s.ScenarioGroup.Name)
                .ThenByDescending(s => s.Version);

            Languages = Database.GetLanguages(false);

            return Page();
        }

        private void GetLogs(string userID)
        {
            Logs = Database.Logs
                .Include(l => l.User)
                    .ThenInclude(up => up.User)
                .Where(l => l.UserId == userID
                    && l.ReportId == null)
                .OrderBy(l => l.Id)
                .ToArray();
            Response.RegisterForDispose(Logs);
        }

        private Task<IActionResult> WithIdentityUserAsync(string opName, string userID, Func<IdentityUser, Task<(string, IdentityResult)>> act) =>
            WithStatusReportAsync(opName, () => OnGetAsync(userID), async () =>
            {
                if (string.IsNullOrEmpty(userID))
                {
                    throw new Exception("No user ID provided");
                }

                var user = await users.FindByIdAsync(userID)
                    ?? throw new Exception($"No user found for id {userID}");

                var (message, result) = await act(user);
                result.Check();

                if (message?.StartsWith("redirect:") == true)
                {
                    return message;
                }

                return $"User {user.UserName} {message}.";
            });

        public class SaveUserProfileChanges
        {
            public string RoomName { get; set; }
            public string OrgName { get; set; }
            public string FullName { get; set; }
            public string DisplayName { get; set; }
            public string HeadsetID { get; set; }
            public DateTimeOffset? CreatedOn { get; set; }
#if DEBUG
            public string Password { get; set; }
#endif
        }

        public Task<IActionResult> OnPostSaveProfileAsync([FromRoute] string userID, [FromForm] SaveUserProfileChanges input) =>
            WithIdentityUserAsync("save profile for", userID, async user =>
            {
                if (string.IsNullOrWhiteSpace(input?.FullName)
                    || string.IsNullOrWhiteSpace(input?.DisplayName))
                {
                    throw new InvalidOperationException("Internal system error");
                }

                var profile = await Database.GetUserProfileAsync(userID)
                    ?? throw new FileNotFoundException($"No user found for id {userID}");

                var identUser = await users.FindByIdAsync(profile.UserId)
                    ?? throw new FileNotFoundException($"No user found for id {userID}");

                var isHeadset = await users.IsInRoleAsync(identUser, Role.Headset);

                var message = new List<string>();
                if (input.FullName != profile.FullName)
                {
                    message.Add($@"Full name changed from ""{profile.FullName}"" to ""{input.FullName}""");
                    profile.FullName = input.FullName;
                }

                if (input.DisplayName != profile.DisplayName)
                {
                    message.Add($@"Display name changed from ""{profile.DisplayName}"" to ""{input.DisplayName}""");
                    profile.DisplayName = input.DisplayName;
                }

                if (input.OrgName != profile.Organization?.Name)
                {
                    if (input.OrgName?.Length == 0)
                    {
                        input.OrgName = null;
                    }

                    message.Add($@"Organization changed from ""{profile.Organization?.Name ?? "none"}"" to ""{input.OrgName ?? "none"}""");
                    profile.Organization = Database.Organizations
                        .SingleOrDefault(org => org.Name == input.OrgName);
                }

                if (input.RoomName != profile.Room?.Name)
                {
                    if (input.RoomName?.Length == 0)
                    {
                        input.RoomName = null;
                    }

                    message.Add($@"Classroom changed from ""{profile.Room?.Name ?? "none"}"" to ""{input.RoomName ?? "none"}""");
                    profile.Room = Database.Rooms
                        .SingleOrDefault(r => r.Name == input.RoomName);
                }

                if (input.CreatedOn is not null
                    && input.CreatedOn.Value != profile.Timestamp)
                {
                    message.Add($@"Created date changed from ""{profile.Timestamp}"" to ""{input.CreatedOn}""");
                    profile.Timestamp = input.CreatedOn.Value.ToUniversalTime().UtcDateTime;
                }

                if (!isHeadset && input.HeadsetID != profile.HeadsetId)
                {
                    var headset = await Database.GetUserProfileAsync(input.HeadsetID);
                    message.Add($@"Headset changed from ""{profile.Headset?.FullName ?? "none"}"" to ""{headset?.FullName ?? "none"}""");
                    profile.HeadsetId = input.HeadsetID;
                }

                if (message.Count > 0)
                {
                    await Database.SaveChangesAsync();
                }

                IdentityResult result = null;
#if DEBUG
                if (IsDev && !string.IsNullOrEmpty(input.Password))
                {
                    message.Add("Password changed");
                    var token = await users.GeneratePasswordResetTokenAsync(user);
                    result = await users.ResetPasswordAsync(user, token, input.Password);
                }
#else
                await Task.CompletedTask;
#endif

                if (message.Count > 0)
                {
                    return (
                        $"User profile changed successfully:\n{string.Join('\n', message)}",
                        result ?? IdentityResult.Success
                    );
                }
                else
                {
                    return (
                        "No changes made.",
                        IdentityResult.Success
                    );
                }
            });

        public Task<IActionResult> OnPostSetRoleAsync([FromRoute] string userID, [FromForm] NameInput input) =>
            WithIdentityUserAsync("set role for", userID, async (user) =>
            {
                if (string.IsNullOrEmpty(input?.Name)
                || !await roles.RoleExistsAsync(input.Name))
                {
                    throw new Exception("System error");
                }

                var (added, result) = await users.ToggleUserRole(user, input.Name);
                var op = added ? "added to" : "removed from";
                return (
                    $@"{op} role ""{input.Name}""",
                    result
                );
            });

        public Task<IActionResult> OnPostResetPasswordAsync([FromRoute] string userID) =>
            WithIdentityUserAsync("reset password for", userID, async (user) =>
            (
                "password reset",
                await users.SendPasswordChangeEmailAsync(Request, Logger, Url, email, user, config.GetValue<string>("Mail:From"), "DLS VR Editor", "Diplomatic Language Services", !IsDev)
            ));

        public Task<IActionResult> OnPostAddLockoutAsync([FromRoute] string userID) =>
            WithIdentityUserAsync("lockout", userID, async (user) =>
            (
                "locked",
                await users.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue)
            ));

        public Task<IActionResult> OnPostRemoveLockoutAsync([FromRoute] string userID) =>
            WithIdentityUserAsync("unlock", userID, async (user) =>
            (
                "unlocked",
                await users.SetLockoutEndDateAsync(user, null)
            ));

        public Task<IActionResult> OnPostDeleteAsync([FromRoute] string userID) =>
            WithIdentityUserAsync("delete", userID, async (user) =>
            (
                "redirect:~/Editor/Users",
                await users.DeleteAsync(user)
            ));

        private Task<IActionResult> WithSelectedLogs(string opName, string userID, Func<IQueryable<Log>, Task<string>> act) =>
            WithStatusReportAsync(opName, () => OnGetAsync(userID), () =>
            {
                GetLogs(userID);
                var logIDs = Logs.Where((l, i) => SelectedLog[i])
                    .Select(l => l.Id)
                    .ToArray();
                return Database.WithLogs(userID, logIDs, Response, act);
            });


        public Task<IActionResult> OnPostCreateReportAsync([FromRoute] string userID) =>
            WithSelectedLogs("create report for", userID, (logs) =>
                Database.CreateReportAsync(userID, logs));

        public Task<IActionResult> OnPostDeleteLogsAsync([FromRoute] string userID) =>
            WithSelectedLogs("delete logs for", userID, Database.DeleteLogsAsync);
    }
}
