using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;

namespace Yarrow.Pages.Editor
{
    public class SettingsModel : EditorPageModel
    {
        public IEnumerable<Setting> Settings { get; private set; }
        public IEnumerable<WebRtc> Servers { get; private set; }

        public SettingsModel(YarrowContext db, IWebHostEnvironment env, ILogger<SettingsModel> logger)
            : base(db, "setting", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            Settings = Database.Settings
                .AsNoTracking()
                .OrderBy(s => s.Name)
                .AsEnumerable();

            Servers = Database.WebRtcs
                .AsNoTracking()
                .OrderBy(s => s.Host)
                .ThenBy(s => s.Protocol)
                .AsEnumerable();

            return Page();
        }

        public Task<IActionResult> OnPostCreateSetting(Setting setting) =>
            WithStatusReportAsync("create",
                OnGet,
                async () =>
                {
                    Database.Settings.Add(setting);
                    await Database.SaveChangesAsync();
                    return $"Created setting {setting.Name} = {setting.Value}.";
                });

        public Task<IActionResult> OnPostUpdateSetting(Setting input) =>
            WithStatusReportAsync("update",
                OnGet,
                async () =>
                {
                    var setting = Database.Settings.Single(s => s.Name == input.Name);
                    if (setting.Value != input.Value)
                    {
                        var message = $"Updated setting {input.Name} value from {setting.Value} to {input.Value}.";
                        setting.Value = input.Value;

                        await Database.SaveChangesAsync();
                        return message;
                    }

                    return "No change.";
                });

        public Task<IActionResult> OnPostDeleteSetting(Setting input) =>
            WithStatusReportAsync("delete",
                OnGet,
                async () =>
                {
                    var setting = Database.Settings.Single(s => s.Name == input.Name);
                    Database.Settings.Remove(setting);
                    await Database.SaveChangesAsync();
                    return $"Deleted setting {input.Name}.";
                });

        public Task<IActionResult> OnPostCreateWebRTC(WebRtc server) =>
            WithStatusReportAsync("create",
                OnGet,
                async () =>
                {
                    server.Id = 0;
                    server.Enabled = true;
                    Database.WebRtcs.Add(server);

                    await Database.SaveChangesAsync();
                    return $"Created WebRTC Server entry.";
                });

        public Task<IActionResult> OnPostToggleWebRTCEnabled(WebRtc input) =>
            WithStatusReportAsync("toggle-enabled",
                OnGet,
                async () =>
                {
                    var setting = Database.WebRtcs.Single(s => s.Id == input.Id);
                    setting.Enabled = !setting.Enabled;

                    await Database.SaveChangesAsync();
                    return $"{(setting.Enabled == true ? "Enabled" : "Disabled")}";
                });

        public Task<IActionResult> OnPostUpdateWebRTC(WebRtc input) =>
            WithStatusReportAsync("update",
                OnGet,
                async () =>
                {
                    var messages = new List<string>();
                    var setting = Database.WebRtcs.Single(s => s.Id == input.Id);

                    if (setting.Protocol != input.Protocol)
                    {
                        messages.Add($"Changed WebRTC server entry's protocol from {setting.Protocol} to {input.Protocol}");
                        setting.Protocol = input.Protocol;
                    }

                    if (setting.Host != input.Host)
                    {
                        messages.Add($"Changed WebRTC server entry's host from {setting.Host} to {input.Host}");
                        setting.Host = input.Host;
                    }

                    if (setting.Port != input.Port)
                    {
                        messages.Add($"Changed WebRTC server entry's port from {setting.Port} to {input.Port}");
                        setting.Port = input.Port;
                    }

                    if (messages.Count > 0)
                    {
                        await Database.SaveChangesAsync();
                        return string.Join("\n", messages);
                    }

                    return "No change.";
                });

        public Task<IActionResult> OnPostDeleteWebRTC(WebRtc server) =>
            WithStatusReportAsync("delete",
                OnGet,
                async () =>
                {
                    var toDelete = Database.WebRtcs.Single(s => s.Id == server.Id);
                    Database.WebRtcs.Remove(toDelete);

                    await Database.SaveChangesAsync();
                    return $"Deleted WebRCT setting entry";
                });
    }
}
