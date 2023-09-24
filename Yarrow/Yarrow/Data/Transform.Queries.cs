using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public async Task DeleteTransformTree(ScenarioSnapshot scenario, int startTransformId)
        {
            var allTransforms = Transforms
                .Include(t => t.Station)
                    .ThenInclude(s => s.StationConnectionFromStations)
                .Include(t => t.Station)
                    .ThenInclude(s => s.StationConnectionToStations)
                .Include(t => t.Signs)
                .Include(t => t.Models)
                .Include(t => t.AudioTracks)
                .Include(t => t.VideoClips)
                .Include(t => t.Texts)
                .Where(t => t.ScenarioId == scenario.Id);

            var children = new Dictionary<int, List<Transform>>();
            Transform startTransform = null;
            foreach (var transform in allTransforms)
            {
                if (transform.Id == startTransformId)
                {
                    startTransform = transform;
                }

                children.Add(transform.Id, new List<Transform>());
            }

            if (startTransform is null)
            {
                throw new FileNotFoundException("Transform::" + startTransformId);
            }

            foreach (var transform in allTransforms)
            {
                if (transform.ParentTransformId is not null)
                {
                    children[transform.ParentTransformId.Value].Add(transform);
                }
            }

            var transforms = new List<Transform>();
            var toConsider = new Queue<Transform> { startTransform };
            while (toConsider.Count > 0)
            {
                var t = toConsider.Dequeue();
                transforms.Add(t);
                toConsider.AddRange(children[t.Id]);

                if (t.Id == scenario.StartStationId)
                {
                    scenario.StartStationId = null;
                    await SaveChangesAsync();
                }
            }

            var audioTracks = transforms.SelectMany(t => t.AudioTracks);
            var videoClips = transforms.SelectMany(t => t.VideoClips);
            var texts = transforms.SelectMany(t => t.Texts);
            var signs = transforms.SelectMany(t => t.Signs);
            var models = transforms.SelectMany(t => t.Models);
            var stations = transforms
                .Where(t => t.Station is not null)
                .Select(t => t.Station);
            var connections = stations.SelectMany(s => s.StationConnectionToStations)
                .Union(stations.SelectMany(s => s.StationConnectionFromStations))
                .Distinct();

            AudioTracks.RemoveRange(audioTracks);
            Signs.RemoveRange(signs);
            Models.RemoveRange(models);
            VideoClips.RemoveRange(videoClips);
            Texts.RemoveRange(texts);
            StationConnections.RemoveRange(connections);
            Stations.RemoveRange(stations);
            Transforms.RemoveRange(transforms);

            await SaveChangesAsync();
        }
    }
}
