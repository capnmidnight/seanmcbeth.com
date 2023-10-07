using Juniper.Services;
using static Juniper.Services.EmailMessage;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

using System.Web;
using System.Net;
using Azure.Core;

namespace Yarrow.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class RequestAccountModel : PageModel
    {
        private readonly ILogger<LoginModel> logger;
        private readonly UserManager<IdentityUser> users;
        private readonly IEmailSender email;
        private readonly IWebHostEnvironment env;
        private readonly IConfiguration config;

        public RequestAccountModel(ILogger<LoginModel> logger, UserManager<IdentityUser> users, IEmailSender email, IWebHostEnvironment env, IConfiguration config)
        {
            this.logger = logger;
            this.users = users;
            this.email = email;
            this.env = env;
            this.config = config;
        }

        [BindProperty]
        public string Email { get; set; }

        [BindProperty]
        public string Name { get; set; }

        public string CreateLink { get; private set; }

        public bool? Success { get; set; }

        public void OnGet()
        {
            Success = null;
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

        public async Task<IActionResult> OnPostAsync()
        {
            var createLink = $"/Editor/Users/?name={HttpUtility.UrlEncode(Name)}&email={HttpUtility.UrlEncode(Email)}";
            if (IsDev)
            {
                Success = true;
                CreateLink = createLink;
            }
            else
            {
                // slow down hackers trying to drag the database.
                await Task.Delay(3000);
            }

            if (ModelState.IsValid)
            {
                try
                {
                    var siteUrl = $"{Request.Scheme}://{Request.Host}";
                    var user = await users.FindByEmailAsync(Email);
                    var msg = new EmailMessage(config.GetValue<string>("Mail:From"),
                        user is not null
                            ? "Duplicate Account Request"
                            : $"New Account Request: {Name}");
                    msg += H1(
                        user is not null
                            ? "Duplicate Editor Account Request"
                            : "New Editor Account Request");

                    if (user is not null)
                    {
                        var usersPage = $"{siteUrl}/Editor/Users";
                        usersPage = A(usersPage);
                        msg += P($@"A person has requested a user account for {Name} at the email address {Email}, but an account for
that address already exists.");
                        msg += P($@"Please validate that this is an authorized user and reset their password from the Editor dashboard
at {usersPage}.");
                    }
                    else
                    {
                        createLink = $"{siteUrl}{createLink}";
                        createLink = A(createLink);
                        msg += P($@"A person has requested a user account for {Name} at the email address {Email}.
Please validate that this is an authorized user and create a new account from the Editor dashboard
at {createLink}.");
                    }


                    msg += Thanks("Yarrow");

                    if (!IsDev)
                    {
                        await (msg >> email);
                    }
                    else
                    {
                        logger.LogInformation("Message sent to admin: {msg}", msg);
                    }

                    Success = true;
                }
                catch (Exception exp)
                {
                    logger.LogError("Error reseting password for {Email}: {Message}", Email, exp.Message);
                    Success = false;
                }
            }

            return Page();
        }
    }
}
