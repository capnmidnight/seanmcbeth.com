using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Files
{

    public class IndexModel : EditorPageModel
    {
        public IEnumerable<FileWithUsageCount> Files { get; private set; }

        public IEnumerable<string> Tags { get; private set; }

        public IEnumerable<string> MimeTypes { get; private set; }

        public int FileCount { get; private set; }

        public string FilesSize { get; private set; }

        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "file", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            Files = Database.Files
                .AsNoTracking()
                .Include(f => f.MenuItems)
                .Include(f => f.GsvMetadatum)
                .Include(f => f.AudioTracks)
                    .ThenInclude(a => a.Transform)
                .Include(f => f.Signs)
                    .ThenInclude(s => s.Transform)
                .Include(f => f.Models)
                    .ThenInclude(m => m.Transform)
                .Include(f => f.VideoClips)
                    .ThenInclude(v => v.Transform)
                .Include(f => f.Texts)
                    .ThenInclude(t => t.Transform)
                .Include(f => f.Stations)
                    .ThenInclude(s => s.Transform)
                .Include(f => f.Tags)
                .OrderBy(f => f.Name)
                .ThenBy(f => f.AltMime)
                .ThenBy(f => f.Mime)
                .Select(f => new FileWithUsageCount(f));

            FileCount = Files.Count();

            FilesSize = Juniper.Units.FileSize.Format(
                Files.Select(f => (long)f.Size).Sum());

            MimeTypes = Files
                .Select(f => f.MediaType)
                .Distinct()
                .OrderBy(t => t);

            Tags = Database.FileTags
                .AsNoTracking()
                .OrderBy(t => t.Name)
                .Select(t => t.Name);

            return Page();
        }
    }
}
