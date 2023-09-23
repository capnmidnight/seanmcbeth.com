using Juniper;

using Microsoft.EntityFrameworkCore;

using System.Data;
using System.IO.Compression;
using System.Linq.Expressions;
using System.Text.Json;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        private ScenarioOutputFull MakeFullScenarioOutput(int? orgId, ScenarioGroup scenarioGroup, Scenario scenario)
        {
            if (orgId is not null && !scenarioGroup.Organizations.Any(o => o.Id == orgId))
            {
                throw new UnauthorizedAccessException();
            }

            var versions = scenarioGroup
                .Scenarios
                .Select(s => new ScenarioVersionOutput(s));

            var transforms = Transforms
                .Where(t => t.ScenarioId == scenario.Id)
                .Select(t => new TransformOutput(t));

            var connections = StationConnections
                .Include(c => c.Transform)
                .Include(c => c.FromStation)
                    .ThenInclude(s => s.Transform)
                .Include(c => c.ToStation)
                    .ThenInclude(s => s.Transform)
                .Where(c => c.Transform != null && c.Transform.ScenarioId == scenario.Id
                    && c.FromStation != null && c.FromStation.Transform != null && c.FromStation.Transform.ScenarioId == scenario.Id
                    && c.ToStation != null && c.ToStation.Transform != null && c.ToStation.Transform.ScenarioId == scenario.Id)
                .Select(stc => new StationConnectionOutput(stc));

            IQueryable<V> getter<T, V>(DbSet<T> table, Expression<Func<T, V>> create) where T : class, IAsset =>
                table
                    .Include(v => v.Transform)
                    .Include(v => v.File)
                        .ThenInclude(v => v.Tags)
                    .Where(v => v.Transform.ScenarioId == scenario.Id)
                    .Select(create);

            var stations = getter(Stations, v => new StationOutput(scenario, v));
            var audioTracks = getter(AudioTracks, v => new AudioTrackOutput(scenario, v));
            var signs = getter(Signs, v => new SignOutput(scenario, v));
            var models = getter(Models, v => new ModelOutput(scenario, v));
            var videoClips = getter(VideoClips, v => new VideoClipOutput(scenario, v));
            var texts = getter(Texts, v => new TextOutput(scenario, v));

            return new ScenarioOutputFull(
                scenario,
                versions,
                transforms,
                stations,
                connections,
                audioTracks,
                videoClips,
                texts,
                signs,
                models);
        }

        private Task<ScenarioGroup> GetScenarioGroup(Expression<Func<ScenarioGroup, bool>> predicate) =>
            ScenarioGroups
                .Include(sg => sg.Organizations)
                .Include(sg => sg.Language)
                .Include(sg => sg.Scenarios)
                    .ThenInclude(s => s.CreatedBy)
                .Include(sg => sg.Scenarios)
                    .ThenInclude(s => s.PublishedBy)
                .Include(sg => sg.CreatedBy)
                .FirstOrDefaultAsync(predicate)
                ?? throw new FileNotFoundException();

        private async Task<Scenario> DuplicateScenarioAsync(ScenarioGroup scenarioGroup, Scenario scenario, ScenarioOutputFull data, int version, string createdByUserId)
        {
            var scenarioCopy = new Scenario
            {
                ScenarioGroup = scenarioGroup,
                OriginAltitude = scenario.OriginAltitude,
                OriginLatitude = scenario.OriginLatitude,
                OriginLongitude = scenario.OriginLongitude,
                StartRotation = scenario.StartRotation,
                Version = version,
                Published = false,
                CreatedById = createdByUserId
            };

            await SaveScenarioDataAsync(scenarioCopy, data, fileId => Files.Single(f => f.Id == fileId));

            return scenarioCopy;
        }

        private async Task SaveScenarioDataAsync(Scenario scenario, ScenarioOutputFull data, Func<int, File> mapFile)
        {
            var transforms = data.Transforms
                .ToDictionary(
                    t => t.ID,
                    t => new Transform
                    {
                        Scenario = scenario,
                        Matrix = t.Matrix,
                        Name = t.Name
                    });

            foreach (var t in data.Transforms)
            {
                if (t.ParentTransformID != 0)
                {
                    transforms[t.ID].ParentTransform = transforms[t.ParentTransformID];
                }
            }

            var stations = data.Stations
                .ToDictionary(
                    s => s.TransformID,
                    s => new Station
                    {
                        File = mapFile(s.FileID),
                        Latitude = (float)s.Location.Lat,
                        Longitude = (float)s.Location.Lng,
                        Altitude = (float)s.Location.Alt,
                        Rotation = s.Rotation,
                        Transform = transforms[s.TransformID],
                        Zone = s.Zone ?? "",
                        Label = s.Label ?? ""
                    });

            var connections = data.Connections
                .Select(c => new StationConnection
                {
                    Transform = c.TransformID == null ? null : transforms[c.TransformID.Value],
                    FromStation = stations[c.FromStationID],
                    ToStation = stations[c.ToStationID],
                    Label = c.Label
                });

            var audioTracks = data.AudioTracks
                .Select(a => new AudioTrack
                {
                    Transform = transforms[a.TransformID],
                    Enabled = a.Enabled,
                    File = mapFile(a.FileID),
                    MinDistance = a.MinDistance,
                    MaxDistance = a.MaxDistance,
                    Spatialize = a.Spatialize,
                    Volume = a.Volume,
                    Zone = a.Zone ?? "",
                    Label = a.Label ?? ""
                });

            var signs = data.Signs
                .Select(s => new Sign
                {
                    Transform = transforms[s.TransformID],
                    File = mapFile(s.FileID),
                    IsCallout = s.IsCallout,
                    AlwaysVisible = s.AlwaysVisible
                });

            var models = data.Models
                .Select(m => new Model
                {
                    Transform = transforms[m.TransformID],
                    File = mapFile(m.FileID),
                    IsGrabbable = m.IsGrabbable
                });

            var videoClips = data.VideoClips
                .Select(v => new VideoClip
                {
                    Transform = transforms[v.TransformID],
                    Enabled = v.Enabled,
                    File = mapFile(v.FileID),
                    Volume = v.Volume,
                    Label = v.Label ?? ""
                });

            var texts = data.Texts
                .Select(v => new Text
                {
                    Transform = transforms[v.TransformID],
                    File = mapFile(v.FileID),
                    IsCallout = v.IsCallout,
                    AlwaysVisible = v.AlwaysVisible
                });


            await Scenarios.AddAsync(scenario);
            await Transforms.AddRangeAsync(transforms.Values);
            await Stations.AddRangeAsync(stations.Values);
            await StationConnections.AddRangeAsync(connections);
            await AudioTracks.AddRangeAsync(audioTracks);
            await VideoClips.AddRangeAsync(videoClips);
            await Texts.AddRangeAsync(texts);
            await Signs.AddRangeAsync(signs);
            await Models.AddRangeAsync(models);

            await SaveChangesAsync();

            if (data.StartStationID is not null)
            {
                scenario.StartStationId = stations[data.StartStationID.Value].TransformId;
            }

            await SaveChangesAsync();
        }

        public async Task<ScenarioOutputFull> GetFullScenarioOutputAsync(int? orgId, int scenarioID)
        {
            var scenarioGroup = await GetScenarioGroup(sg => sg.Scenarios.Any(s => s.Id == scenarioID));
            var scenario = scenarioGroup.Scenarios.FirstOrDefault(s => s.Id == scenarioID);
            return MakeFullScenarioOutput(orgId, scenarioGroup, scenario);
        }

        public async Task<ScenarioGroup> DuplicateScenarioGroupAsync(int? orgId, int scenarioGroupID, string createdByUserId)
        {
            var scenarioGroup = await GetScenarioGroup(sg => sg.Id == scenarioGroupID);
            var scenario = scenarioGroup
                .Scenarios
                .OrderByDescending(s => s.Version)
                .FirstOrDefault();

            var data = MakeFullScenarioOutput(orgId, scenarioGroup, scenario);

            var scenarioGroupCopy = new ScenarioGroup
            {
                LanguageId = scenarioGroup.LanguageId,
                Name = scenarioGroup.Name + " - Copy",
                Organizations = scenarioGroup.Organizations,
                CreatedById = createdByUserId
            };

            await ScenarioGroups.AddAsync(scenarioGroupCopy);

            await DuplicateScenarioAsync(scenarioGroupCopy, scenario, data, 1, createdByUserId);

            return scenarioGroupCopy;
        }

        public async Task<Scenario> BumpScenarioVersionAsync(int? orgId, int scenarioID, string createdByUserId)
        {
            var scenarioGroup = await GetScenarioGroup(sg => sg.Scenarios.Any(s => s.Id == scenarioID));
            var scenario = scenarioGroup.Scenarios.FirstOrDefault(s => s.Id == scenarioID);
            var data = MakeFullScenarioOutput(orgId, scenarioGroup, scenario);
            var maxVersion = data.Versions.Max(v => v.Version);
            return await DuplicateScenarioAsync(scenarioGroup, scenario, data, maxVersion + 1, createdByUserId);
        }

        public async Task<ScenarioGroup> ImportScenarioAsync(Stream zipStream, string createdByUserId)
        {
            using var zip = new ZipArchive(zipStream, ZipArchiveMode.Read);
            var scenarioEntry = zip.GetEntry("scenario.json");
            using var scenarioStream = scenarioEntry.Open();

            var data = await JsonSerializer.DeserializeAsync<ScenarioOutputFull>(scenarioStream);

            var fileDetails = data.Stations
                .Cast<AbstractFileAsset>()
                .Union(data.AudioTracks)
                .Union(data.VideoClips)
                .Union(data.Texts)
                .Union(data.Signs)
                .Union(data.Models)
                .DistinctBy(f => f.FileID)
                .ToDictionary(f => f.FileID);

            var files = new Dictionary<int, File>();
            foreach (var entry in zip.Entries)
            {
                var name = Path.GetFileNameWithoutExtension(entry.Name);
                if (int.TryParse(name, out var fileID)
                    && fileDetails.TryGetValue(fileID, out var fileDetail))
                {
                    using var entryStream = entry.Open();
                    using var mem = new MemoryStream((int)entry.Length);
                    await entryStream.CopyToAsync(mem);

                    var file = await Files
                        .FirstOrDefaultAsync(f =>
                            f.Name == fileDetail.FileName
                            && f.Mime == fileDetail.TrueMediaType
                            && f.Size == entry.Length);
                    if (file is null)
                    {
                        var fNameCount = await Files.CountAsync(f => f.Name == fileDetail.FileName);
                        var fileName = fNameCount == 0 ? fileDetail.FileName : $"{fileDetail.FileName} ({fNameCount})";
                        file = await SaveFileAsync(
                            fileName,
                            (int)entry.Length,
                            fileDetail.TrueMediaType,
                            fileDetail.MediaType != fileDetail.TrueMediaType ? fileDetail.MediaType : null,
                            mem.ToArray(),
                            fileDetail.FileTagString,
                            fileDetail.Copyright,
                            fileDetail.CopyrightDate?.ToDateOnly());
                    }

                    files.Add(fileID, file);
                }
            }

            var nameCount = await ScenarioGroups
                .CountAsync(s => s.Name == data.Name)
                .ConfigureAwait(false);

            var scenarioName = nameCount == 0
                ? data.Name
                : $"{data.Name} ({nameCount})";

            var languages = await Languages.ToDictionaryAsync(l => l.Name.ToLowerInvariant());
            var language = languages.Get(data.LanguageName.ToLowerInvariant());
            if (language is null)
            {
                language = new Language
                {
                    Name = data.LanguageName
                };
                Languages.Add(language);
            }

            var scenarioGroup = new ScenarioGroup
            {
                Language = language,
                Name = scenarioName,
                CreatedById = createdByUserId
            };

            var scenario = new Scenario
            {
                ScenarioGroup = scenarioGroup,
                StartRotation = data.StartRotation,
                OriginAltitude = (float)data.Origin.Alt,
                OriginLatitude = (float)data.Origin.Lat,
                OriginLongitude = (float)data.Origin.Lng,
                CreatedById = createdByUserId
            };

            await SaveScenarioDataAsync(scenario, data, fileID => files[fileID]);

            return scenarioGroup;
        }

        public async Task ExportScenarioAsync(ZipArchive zip, ScenarioOutputFull scenario, CancellationToken canceller)
        {
            using var conn = Database.GetDbConnection();

            await conn.OpenAsync(canceller)
                .ConfigureAwait(false);

            try
            {
                {
                    var entry = zip.CreateEntry("scenario.json");
                    using var zipStream = entry.Open();
                    await JsonSerializer.SerializeAsync(zipStream, scenario, cancellationToken: canceller)
                        .ConfigureAwait(false);
                    await zipStream.FlushAsync(canceller)
                        .ConfigureAwait(false);
                    zipStream.Close();
                }

                var files = scenario.Stations
                    .Cast<AbstractFileAsset>()
                    .Union(scenario.AudioTracks)
                    .Union(scenario.VideoClips)
                    .Union(scenario.Texts)
                    .Union(scenario.Signs)
                    .Union(scenario.Models)
                    .DistinctBy(v => v.FileID);

                using var cmd = conn.CreateCommand();
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = "select \"Data\" from \"FileContents\" where \"FileID\" = @FileID";
                var pFileID = cmd.CreateParameter();
                pFileID.ParameterName = "FileID";
                cmd.Parameters.Add(pFileID);

                foreach (var file in files)
                {
                    pFileID.Value = file.FileID;
                    using var reader = await cmd.ExecuteReaderAsync(
                    CommandBehavior.SingleResult
                    | CommandBehavior.SequentialAccess,
                    canceller)
                    .ConfigureAwait(false);

                    var read = await reader.ReadAsync(canceller)
                        .ConfigureAwait(false);

                    if (!read)
                    {
                        throw new EndOfStreamException();
                    }

                    using var stream = reader.GetStream(0);
                    var contentType = MediaType.Lookup(file.TrueMediaType);
                    var entry = zip.CreateEntry($"{file.FileID}.{contentType.PrimaryExtension}");
                    using var zipStream = entry.Open();
                    await stream.CopyToAsync(zipStream, canceller)
                        .ConfigureAwait(false);
                    await zipStream.FlushAsync(canceller)
                        .ConfigureAwait(false);
                    zipStream.Close();
                }
            }
            finally
            {
                conn.Close();
            }
        }

        public async Task DeleteScenarioAsync(Scenario scenario)
        {
            scenario.StartStation = null;
        
            var connections = StationConnections
                .Include(c => c.Transform)
                .Include(c => c.FromStation)
                    .ThenInclude(s => s.Transform)
                .Include(c => c.ToStation)
                    .ThenInclude(s => s.Transform)
                .Where(c => c.Transform == null || c.Transform.ScenarioId == scenario.Id
                    || c.FromStation == null || c.FromStation.Transform == null || c.FromStation.Transform.ScenarioId == scenario.Id
                    || c.ToStation == null || c.ToStation.Transform == null || c.ToStation.Transform.ScenarioId == scenario.Id)
                .ToArray();

            StationConnections.RemoveRange(connections);

            await SaveChangesAsync();

            IEnumerable<T> getter<T>(DbSet<T> table) where T : class, IAsset =>
                table
                    .Include(v => v.Transform)
                    .Where(v => v.Transform.ScenarioId == scenario.Id);

            var stations = getter(Stations);
            var audioTracks = getter(AudioTracks);
            var signs = getter(Signs);
            var models = getter(Models);
            var videoClips = getter(VideoClips);
            var texts = getter(Texts);

            var transforms = Transforms.Where(t => t.ScenarioId == scenario.Id);
            foreach (var trans in transforms)
            {
                trans.ParentTransformId = null;
            }

            Signs.RemoveRange(signs);
            Models.RemoveRange(models);
            AudioTracks.RemoveRange(audioTracks);
            VideoClips.RemoveRange(videoClips);
            Texts.RemoveRange(texts);
            Stations.RemoveRange(stations);
            await SaveChangesAsync();

            Transforms.RemoveRange(transforms);
            Scenarios.Remove(scenario);

            await SaveChangesAsync();
        }
    }
}
