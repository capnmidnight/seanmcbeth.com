using Juniper;
using Juniper.Imaging;
using Juniper.IO;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Text.Json;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Files
{

    public class DetailModel : EditorPageModel
    {
        public DetailModel(YarrowContext db, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "file", env, logger)
        {
        }

        public FileWithUsageCount FileInfo { get; private set; }
        public string FileInfoJSON { get; private set; }
        public string OriginURL { get; private set; }

        public bool HideBanner { get; private set; }

        public IEnumerable<string> Tags { get; private set; }

        private async Task<FileWithUsageCount> GetInfo(int fileID)
        {
            return new FileWithUsageCount(await Database.Files
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
                .SingleOrDefaultAsync(f => f.Id == fileID));
        }

        private async Task<Data.File> GetData(int fileID)
        {
            return await Database.Files
                .Include(f => f.MenuItems)
                .Include(f => f.AudioTracks)
                .Include(f => f.GsvMetadatum)
                .Include(f => f.Signs)
                .Include(f => f.Models)
                .Include(f => f.VideoClips)
                .Include(f => f.Texts)
                .Include(f => f.Stations)
                .Include(f => f.Tags)
                .SingleOrDefaultAsync(f => f.Id == fileID);
        }

        public async Task<IActionResult> OnGetAsync(int fileID)
        {
            if (!CurrentUser.IsEditor)
            {
                return Forbid();
            }

            HideBanner = Request.Query.ContainsKey("hideBanner");
            FileInfo = await GetInfo(fileID);

            if (FileInfo is null)
            {
                return NotFound();
            }

            Tags = Database.GetTags();
            FileInfoJSON = JsonSerializer.Serialize(FileInfo, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            if (FileInfo.IsLink)
            {
                OriginURL = await Database.GetFileAsText(fileID);
            }

            return Page();
        }

        public Task<IActionResult> OnPostTranslate(int fileID) =>
            WithStatusReportAsync("translate",
                () => OnGetAsync(fileID),
                async () =>
                {
                    var fileContent = await Database.FileContents
                        .Include(f => f.File)
                        .SingleAsync(f => f.FileId == fileID);

                    if (fileContent is null)
                    {
                        throw new FileNotFoundException();
                    }

                    var isPng = fileContent.File.Mime == MediaType.Image_Png;
                    var isJpeg = fileContent.File.Mime == MediaType.Image_Jpeg;

                    if (!isPng && !isJpeg)
                    {
                        throw new InvalidOperationException("Can only convert PNGs and JPEGs");
                    }

                    var png = new PngFactory().Pipe(new PngCodec());
                    var jpg = new JpegFactory().Pipe(new JpegCodec());
                    var from = isPng ? png : jpg;
                    var to = isPng ? jpg : png;
                    var fromType = isPng ? "PNG" : "JPEG";
                    var toType = isPng ? "JPEG" : "PNG";

                    using var inStream = new MemoryStream(fileContent.Data);
                    var image = from.Deserialize(inStream);
                    await inStream.FlushAsync();
                    fileContent.Data = to.Serialize(image);
                    fileContent.File.Size = fileContent.Data.Length;
                    fileContent.File.Mime = to.InputContentType;
                    await Database.SaveChangesAsync();
                    return $"Translated from {fromType} to {toType}";
                });

        public async Task<IActionResult> OnPostTagAsync(int fileID, [FromBody] string tagsString)
        {
            var fileInfo = await GetData(fileID);

            if (fileInfo is null)
            {
                return NotFound();
            }

            var existingTags = Database.FileTags
                .ToDictionary(t => t.Name, t => t);

            var existingFileTagNames = fileInfo.Tags
                .Select(t => t.Name)
                .ToArray();

            var newTagNames = tagsString.Split(',')
                .Select(s => s.Trim().ToLowerInvariant())
                .Distinct()
                .ToArray();

            var toDelete = fileInfo.Tags
                .Where(t => !newTagNames.Contains(t.Name))
                .ToArray();

            var toAdd = newTagNames
                .Where(t => !existingFileTagNames.Contains(t))
                .Select(t => existingTags.ContainsKey(t)
                    ? existingTags[t]
                    : new FileTag { Name = t })
                .ToArray();

            foreach (var tag in toDelete)
            {
                fileInfo.Tags.Remove(tag);
            }

            foreach (var tag in toAdd)
            {
                fileInfo.Tags.Add(tag);
            }

            await Database.SaveChangesAsync();

            return new OkResult();
        }

        public Task<IActionResult> OnPostUploadAsync(int fileID, [FromForm] FileUploadInput fileUpload) =>
            WithStatusReportAsync("replace",
                () => OnGetAsync(fileID),
                async () =>
                {
                    await Database.SaveFileAsync(
                        fileUpload.FormFile,
                        null,
                        null,
                        fileUpload.Copyright,
                        fileUpload.CopyrightDate.ToDateOnly(),
                        fileID);

                    await Database.SaveChangesAsync();

                    return "Replaced";
                });

        public Task<IActionResult> OnPostDeleteAsync(int fileID) =>
            WithStatusReportAsync("delete",
                () => OnGetAsync(fileID),
                async () =>
                {
                    await Database.DeleteFileAsync(fileID);

                    return "redirect:~/Editor/Files";
                });

        public async Task<IActionResult> OnPostRenameAsync(int fileID, [FromBody] string fileName)
        {
            var file = await GetData(fileID);

            if (file is null)
            {
                return NotFound();
            }

            file.Name = fileName;

            var transforms = Database.Transforms
                .Include(t => t.Station)
                .Where(t => t.Station.FileId == fileID);

            foreach (var transform in transforms)
            {
                transform.Name = fileName;
            }

            await Database.SaveChangesAsync();

            return new OkResult();
        }
    }
}
