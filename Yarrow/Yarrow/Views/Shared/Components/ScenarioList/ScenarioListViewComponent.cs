using Microsoft.AspNetCore.Mvc;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Views.Shared.Components.ScenarioList
{
    public class ScenarioListViewComponent : ViewComponent
    {
        private readonly YarrowContext db;
        public ScenarioListViewComponent(YarrowContext db)
        {
            this.db = db;
        }

        public record Model(
            bool AdminView,
            bool ShowCreatedBy,
            bool ShowCreateScenario,
            string PageSizes,
            string ResourceName,
            Language Language,
            Organization Organization,
            IEnumerable<Language> Languages,
            IEnumerable<Organization> Organizations,
            IEnumerable<ScenarioGroup> ScenarioGroups);

        public IViewComponentResult Invoke(
            UserOutput currentUser,
            int? langId = null,
            int? orgId = null,
            bool showCreateScenario = true,
            string createdById = null,
            string pageSizes = null,
            string resourceName = null)
        {
            var showLanguagesColumn = langId is null;
            // all users should be able to see all languages.
            var langs = showLanguagesColumn ? db.GetLanguages(currentUser.IsAdmin) : null;
            var lang = !showLanguagesColumn ? db.Languages.FirstOrDefault(l => l.Id == langId) : null;


            var showOrgColumn = orgId is null;
            // restrict not-admin users to only seeing their own organization,
            // but let admin users see other organizations.
            orgId ??= currentUser.VisibleOrganizationID;

            var orgs = showOrgColumn ? db.Organizations.Where(o => orgId == null || o.Id == orgId) : null;
            var org = !showOrgColumn ? db.Organizations.FirstOrDefault(o => o.Id == orgId) : null;
            var menuOrgId = orgId;
            if (currentUser.IsAdmin)
            {
                // let admins see all scenarios for any org
                orgId = null;
            }

            var scenarios = db.GetScenarioGroups(menuOrgId, langId, orgId, createdById);

            return View(new Model(
                currentUser.IsAdmin,
                createdById is null,
                showCreateScenario,
                pageSizes,
                resourceName,
                lang,
                org,
                langs,
                orgs,
                scenarios));
        }
    }
}
