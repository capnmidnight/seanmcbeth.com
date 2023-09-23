using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Scenarios
{
    public class StationsModel : DbPageModel
    {
        public StationsModel(YarrowContext db)
            : base(db)
        {
        }

        public async Task<IActionResult> OnPostAddAsync(int scenarioID, [FromBody] StationCreateInput input)
        {
            var scenario = await Database.Scenarios
                .Include(scn => scn.StartStation)
                .SingleAsync(scn => scn.Id == scenarioID);

            var file = await Database.GetFileAsync(input.FileID);

            if (file is null)
            {
                return NotFound();
            }

            var transform = await Database.Transforms
                .SingleOrDefaultAsync(t => t.Id == input.TransformID);

            var station = new Station
            {
                FileId = input.FileID,
                Latitude = input.Latitude,
                Longitude = input.Longitude,
                Altitude = input.Altitude,
                Rotation = input.Rotation,
                Zone = input.Zone ?? "",
                Label = "",
                Transform = transform
            };

            await Database
                .Stations
                .AddAsync(station);

            if (scenario.StartStation is null)
            {
                scenario.StartStation = station;
            }

            await Database.SaveChangesAsync();

            return new ObjectResult(new StationOutput(scenario, station));
        }

        public async Task<IActionResult> OnPostDeleteAsync(int scenarioID, [FromBody] int stationID)
        {
            var scenario = await Database.Scenarios
                .SingleOrDefaultAsync(scn => scn.Id == scenarioID);

            if (scenario is null)
            {
                return NotFound();
            }

            var station = await Database.Stations
                .Include(st => st.Transform)
                .SingleOrDefaultAsync(st => st.TransformId == stationID);

            if (station is null)
            {
                return BadRequest();
            }

            await Database.DeleteTransformTree(scenario, station.TransformId);

            return new ObjectResult(scenario.StartStationId);
        }

        public async Task<IActionResult> OnPostMarkStartAsync(int scenarioID, [FromBody] int stationID)
        {
            var scenario = await Database.Scenarios
                .SingleAsync(scenario => scenario.Id == scenarioID);

            scenario.StartStationId = stationID;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public async Task<IActionResult> OnPostSetStartRotationAsync(int scenarioID, [FromBody] float startRotation)
        {
            var scenario = await Database.Scenarios
                .SingleAsync(scenario => scenario.Id == scenarioID);

            scenario.StartRotation = startRotation;

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        private async Task<IActionResult> EditStation(int scenarioID, int stationID, Action<Station> edit)
        {
            var station = await Database.Stations
                .Include(station => station.Transform)
                .Include(station => station.File)
                .SingleAsync(station => station.TransformId == stationID
                    && station.Transform.ScenarioId == scenarioID);

            edit(station);

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public Task<IActionResult> OnPostUpdateAsync(int scenarioID, [FromBody] StationUpdateInput input)
        {
            return EditStation(scenarioID, input.StationID, (station) =>
            {
                station.File.Name = input.FileName;
                station.Latitude = input.Latitude;
                station.Longitude = input.Longitude;
                station.Altitude = input.Altitude;
                station.Rotation = input.Rotation;
                station.Zone = input.Zone ?? "";
                station.Label = input.Label ?? "";
            });
        }
    }
}
