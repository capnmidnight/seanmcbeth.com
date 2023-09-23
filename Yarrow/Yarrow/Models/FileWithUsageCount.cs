using Yarrow.Data;

namespace Yarrow.Models
{
    public class FileWithUsageCount : FileOutput
    {
        public int Count { get; }
        public IEnumerable<string> Paths { get; }
        public IEnumerable<string> Tags { get; }
        public bool IsLink { get; }

        public FileWithUsageCount(Data.File data)
            : base(data)
        {
            IsLink = data.AltMime is not null;

            Tags = data.Tags
                .OrderBy(t => t.Name)
                .Select(t => t.Name);

            Count = data.MenuItems.Count
                + data.AudioTracks.Count
                + data.Signs.Count
                + data.Models.Count
                + data.VideoClips.Count
                + data.Texts.Count
                + data.Stations.Count;

            var paths = new List<string>();

            foreach (var menuItem in data.MenuItems)
            {
                paths.Add($"/Editor/Menu/{menuItem.Id}");
            }

            foreach (var asset in data.AudioTracks
                .Cast<IAsset>()
                .Union(data.Signs)
                .Union(data.Stations)
                .Union(data.Models)
                .Union(data.VideoClips)
                .Union(data.Texts))
            {
                paths.Add($"/Editor/Scenarios/Layout/{asset.Transform.ScenarioId}");
            }

            Paths = paths.Distinct();
        }
    }
}
