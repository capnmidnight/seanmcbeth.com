using Yarrow.Data;

namespace Yarrow.Models
{
    public class MenuItemOutput
    {
        public int ID { get; set; }
        public int Order { get; set; }
        public string Label { get; set; }
        public int? ParentID { get; set; }
        public string OrganizationName { get; set; }
        public int? FileID { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public int? FileSize { get; set; }
        public int? ScenarioGroupID { get; set; }
        public int? ScenarioID { get; set; }
        public int? AudioElementCount { get; set; }
        public int? VideoElementCount { get; set; }

        public MenuItemOutput()
        {
        }

        public MenuItemOutput(MenuItem menuItem)
        {
            ID = menuItem.Id;
            Order = menuItem.Order;
            Label = menuItem.Label;
            ParentID = menuItem.ParentId;
            OrganizationName = menuItem.Organization?.Name;
            FileID = menuItem.FileId;
            FilePath = menuItem.File?.Path();
            FileName = menuItem.File?.Name;
            FileType = menuItem.File?.Mime;
            FileSize = menuItem.File?.Size;

            ScenarioGroupID = menuItem.ScenarioGroupId;
            if (menuItem.ScenarioGroupId is not null)
            {
                var scenario = menuItem.ScenarioGroup
                    .Scenarios
                    .Where(s => s.Published)
                    .OrderByDescending(s => s.Version)
                    .FirstOrDefault();
                ScenarioID = scenario?.Id;

                VideoElementCount = scenario
                    ?.Transforms
                    ?.SelectMany(t => t.VideoClips)
                    ?.Count()
                    ?? 0;

                AudioElementCount = VideoElementCount + (scenario
                    ?.Transforms
                    ?.SelectMany(t => t.AudioTracks)
                    ?.Count()
                    ?? 0);
            }
        }
    }
}