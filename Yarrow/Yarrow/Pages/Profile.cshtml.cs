using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;

namespace Yarrow.Pages
{
    public class ProfileModel : DbPageModel
    {
        public string StatusType { get; private set; }
        public string StatusMessage { get; private set; }

        public ProfileModel(YarrowContext db)
            : base(db)
        {
        }

        public UserProfile UserProfile { get; private set; }

        public async Task<IActionResult> OnGetAsync()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/");
            }

            UserProfile ??= await Database.GetCurrentUserProfileAsync(User);
            if (UserProfile is null)
            {
                return Unauthorized();
            }

            return Page();
        }

        public class SaveUserProfileChanges
        {
            public string FullName { get; set; }
            public string DisplayName { get; set; }
        }

        public async Task<IActionResult> OnPostAsync([FromForm] SaveUserProfileChanges input)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(input?.FullName)
                    || string.IsNullOrWhiteSpace(input?.DisplayName))
                {
                    throw new InvalidOperationException("Internal system error");
                }

                UserProfile = await Database.GetCurrentUserProfileAsync(User);
                if (UserProfile is null)
                {
                    return NotFound();
                }

                var messageParts = new List<string>();
                if (input.FullName != UserProfile.FullName)
                {
                    messageParts.Add($@"Full name changed from ""{UserProfile.FullName}"" to ""{input.FullName}"".");
                    UserProfile.FullName = input.FullName;
                }

                if (input.DisplayName != UserProfile.DisplayName)
                {
                    messageParts.Add($@"Display name changed from ""{UserProfile.DisplayName}"" to ""{input.DisplayName}"".");
                    UserProfile.DisplayName = input.DisplayName;
                }

                if (messageParts.Count == 0)
                {
                    StatusMessage = "No changes made.";
                }
                else
                {
                    await Database.SaveChangesAsync();
                    StatusMessage = $@"User profile changed successfully:
{string.Join('\n', messageParts)}";
                }

                StatusType = "info";
            }
            catch (Exception ex)
            {
                StatusType = "danger";
                StatusMessage = $"Could not save changes to user profile: {ex.Message}";
            }

            return await OnGetAsync();
        }
    }
}
