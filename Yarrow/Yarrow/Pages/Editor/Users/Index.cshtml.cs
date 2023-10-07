using Juniper.Data.Identity;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;

namespace Yarrow.Pages.Editor.Users
{
    public class IndexModel : EditorPageModel
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly IEmailSender email;
        private readonly IConfiguration config;

        public IndexModel(YarrowContext db, UserManager<IdentityUser> u, IWebHostEnvironment env, IConfiguration config, IEmailSender e, ILogger<IndexModel> logger)
            : base(db, "user", env, logger)
        {
            userManager = u;
            email = e;
            this.config = config;
        }

        [BindProperty(SupportsGet = true)]
        public string Name { get; set; }

        [BindProperty(SupportsGet = true)]
        public string Email { get; set; }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsManager)
            {
                return Forbid();
            }

            return Page();
        }

        public record UserInputModel(string Email, string FullName, string DisplayName, string RoleName, int OrganizationID);

        public Task<IActionResult> OnPostCreateAsync([FromForm] UserInputModel input) =>
            WithStatusReportAsync("create",
                OnGet,
                async () =>
                {
                    if (input?.Email?.IsValidEmail() != true)
                    {
                        throw new Exception("No valid email provided");
                    }

                    if (await userManager.FindByEmailAsync(input.Email) is not null)
                    {
                        throw new Exception($"Email address {input.Email} is already in use");
                    }

                    var user = new IdentityUser
                    {
                        UserName = input.Email,
                        NormalizedUserName = input.Email.ToUpperInvariant(),
                        Email = input.Email,
                        NormalizedEmail = input.Email.ToUpperInvariant(),
                        EmailConfirmed = true,
                        LockoutEnabled = true
                    };

                    var result = await userManager.CreateAsync(user);
                    result.Check();

                    result = await userManager.AddToRoleAsync(user, input.RoleName);
                    result.Check();

                    var profile = new UserProfile
                    {
                        UserId = user.Id,
                        FullName = input.FullName ?? "",
                        DisplayName = input.DisplayName ?? input.Email[..input.Email.IndexOf('@')],
                        OrganizationID = input.OrganizationID
                    };

                    await Database.UserProfiles.AddAsync(profile);
                    await Database.SaveChangesAsync();

                    result = await userManager.SendPasswordChangeEmailAsync(Request, Logger, Url, this.email, user, config.GetValue<string>("Mail:From"), "Yarrow Editor", "Yarrow", !IsDev);
                    result.Check();

                    return $"redirect:~/Editor/Users/Detail/{user.Id}";
                });
    }
}
