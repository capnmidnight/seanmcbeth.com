using Juniper.Data.Identity;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Yarrow.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ForgotPasswordModel : PageModel
    {
        private readonly ILogger<LoginModel> logger;
        private readonly UserManager<IdentityUser> users;
        private readonly IEmailSender email;
        private readonly IConfiguration config;
        private readonly IWebHostEnvironment env;

        public ForgotPasswordModel(ILogger<LoginModel> logger, UserManager<IdentityUser> users, IEmailSender email, IConfiguration config, IWebHostEnvironment env)
        {
            this.logger = logger;
            this.users = users;
            this.email = email;
            this.config = config;
            this.env = env;
        }

        private bool IsDev
        {
            get
            {
#if DEBUG
                return env.IsDevelopment();
#else
                return false;
#endif
            }
        }

        [BindProperty]
        public string Email { get; set; }

        public string StatusMessage { get; set; }

        public void OnGet()
        {
            StatusMessage = "";
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (ModelState.IsValid)
            {
                var user = await users.FindByEmailAsync(Email);
                if (user is null)
                {
                    await Task.Delay(3000); // slow down hackers trying to drag the database.
                    StatusMessage = $"No account found for {Email}";
                }
                else
                {
                    var result = await users.SendPasswordChangeEmailAsync(Request, logger, Url, email, user, config.GetValue<string>("Mail:From"), "VR Editor", "Yarrow", !IsDev);
                    if (result.Succeeded)
                    {
                        StatusMessage = $"An email with a password reset link has been sent to {Email}. Please close this window and continue from the reset link. Reset links expire after 24 hours.";
                    }
                    else
                    {
                        var errors = result.Errors.Select(e => e.Description).ToArray().Join(", ");
                        logger.LogError("Error reseting password for {Email}: {errors}", Email, errors);
                        StatusMessage = "There was an error while attempting to reset the password. Please contact the system adminstrator at sean@seanmcbeth.com";
                    }
                }
            }

            return Page();
        }
    }
}
