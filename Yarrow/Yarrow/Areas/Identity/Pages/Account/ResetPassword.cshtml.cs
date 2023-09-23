using Juniper.Services;
using static Juniper.Services.EmailMessage;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.WebUtilities;

using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Yarrow.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class ResetPasswordModel : PageModel
    {
        private readonly UserManager<IdentityUser> users;
        private readonly IEmailSender email;
        private readonly IConfiguration config;
        private readonly IWebHostEnvironment env;
        private readonly ILogger<ResetPasswordModel> logger;

        public ResetPasswordModel(UserManager<IdentityUser> users, IEmailSender email, IConfiguration config, IWebHostEnvironment env, ILogger<ResetPasswordModel> logger)
        {
            this.users = users;
            this.email = email;
            this.config = config;
            this.env = env;
            this.logger = logger;
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
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [DataType(DataType.Password)]
            [Display(Name = "Confirm password")]
            [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
            public string ConfirmPassword { get; set; }

            public string Code { get; set; }
        }

        public IActionResult OnGet(string code = null, string email = "")
        {
            if (code == null)
            {
                return BadRequest("A code must be supplied for password reset.");
            }
            else
            {
                Input = new InputModel
                {
                    Code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(code)),
                    Email = email
                };
                return Page();
            }
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var user = await users.FindByEmailAsync(Input.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return RedirectToPage("./ResetPasswordConfirmation");
            }

            var result = await users.ResetPasswordAsync(user, Input.Code, Input.Password);
            if (result.Succeeded)
            {
                var siteUrl = $"{Request.Scheme}://{Request.Host}";
                var userProfileUrl = $"{siteUrl}/Editor/Users/Detail/{user.Id}";
                userProfileUrl = A(userProfileUrl, "here");
                var msg = new EmailMessage(config.GetValue<string>("Mail:From"), "Password reset for user " + user.UserName);
                msg += H1($"{user.UserName} has successfully reset their password.");
                msg += P($"You may view their profile {userProfileUrl}.");

                if (!IsDev)
                {
                    await (msg >> email);
                }
                else
                {
                    logger.LogInformation("Message sent to admin: {msg}", msg);
                }

                return RedirectToPage("./ResetPasswordConfirmation");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
            return Page();
        }
    }
}
