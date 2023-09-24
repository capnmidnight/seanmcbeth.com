using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public async Task<string> ToggleScenarioInOrganization(int organizationID, int scenarioGroupID)
        {
            var organization = await Organizations
                .SingleOrDefaultAsync(org => org.Id == organizationID)
                ?? throw new FileNotFoundException();

            var scenarioGroup = GetScenarioGroups(null, null, null)
                .FirstOrDefault(sg => sg.Id == scenarioGroupID)
                ?? throw new FileNotFoundException();

            if (scenarioGroup.Organizations.Contains(organization))
            {
                scenarioGroup.Organizations.Remove(organization);
                await SaveChangesAsync();
                return $"Scenario {scenarioGroup.Name} removed from '{organization.Name}'";
            }
            else
            {
                scenarioGroup.Organizations.Add(organization);
                await SaveChangesAsync();
                return $"Scenario {scenarioGroup.Name} added to '{organization.Name}'";
            }
        }
    }
}
