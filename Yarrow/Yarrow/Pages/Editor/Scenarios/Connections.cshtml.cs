using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class ConnectionsModel : DbPageModel
    {
        public ConnectionsModel(YarrowContext db)
            : base(db)
        {
        }

        public async Task<IActionResult> OnPostCreateAsync(int scenarioID, [FromBody] StationConnectionInput input)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var forward = new StationConnection
            {
                FromStationId = input.FromStationID,
                ToStationId = input.ToStationID
            };

            await Database.StationConnections
                .AddRangeAsync(forward);

            await Database
                .SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostUpdateAsync(int scenarioID, [FromBody] StationConnectionUpdateInput input)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var connection = await Database.StationConnections
                .Include(sc => sc.ToStation)
                    .ThenInclude(s => s.Transform)
                .Include(sc => sc.FromStation)
                    .ThenInclude(s => s.Transform)
                .SingleOrDefaultAsync(sc =>
                    sc.FromStation.Transform.ScenarioId == scenarioID
                    && sc.ToStation.Transform.ScenarioId == scenarioID
                    && sc.FromStationId == input.FromStationID
                    && sc.ToStationId == input.ToStationID);

            if (connection is null)
            {
                return NotFound();
            }

            connection.TransformId = input.TransformID;
            connection.Label = input.Label;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] StationConnectionInput input)
        {
            var scenario = await Database.ScenariosSnapshots
                .SingleOrDefaultAsync(a => a.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var connections = Database.StationConnections
                .Where(c => c.FromStationId == input.FromStationID
                        && c.ToStationId == input.ToStationID
                    || c.FromStationId == input.ToStationID
                        && c.ToStationId == input.FromStationID);

            var transforms = connections.Select(c => c.Transform)
                .Where(t => t != null);

            Database.StationConnections.RemoveRange(connections);
            Database.Transforms.RemoveRange(transforms);

            await Database
                .SaveChangesAsync();

            return new OkResult();
        }
    }
}
