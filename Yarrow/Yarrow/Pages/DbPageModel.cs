
using Microsoft.AspNetCore.Mvc.RazorPages;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages
{
    public abstract class DbPageModel : PageModel
    {
        protected YarrowContext Database { get; }

        private UserOutput _currentUser;
        public UserOutput CurrentUser =>
            _currentUser ??= Database.GetCurrentUserWithRoles(User);

        protected DbPageModel(YarrowContext db)
        {
            Database = db;
        }
    }
}
