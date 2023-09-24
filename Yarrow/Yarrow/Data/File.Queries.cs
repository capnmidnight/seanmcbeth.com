using Juniper;
using Juniper.HTTP;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;

using System.Net;
using System.Text;

using Yarrow.Models;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public IEnumerable<string> GetTags() =>
            FileTags
                .AsNoTracking()
                .OrderBy(t => t.Name)
                .Select(t => t.Name);

        public async Task<File> SaveFileAsync(IFormFile fileInput, string altContentType, string tagsString, string copyright, DateOnly copyrightDate, int? fileID = null)
        {
            if (fileInput is null)
            {
                throw new InvalidOperationException("No file data was provided");
            }

            var fileName = Uri.UnescapeDataString(Path.GetFileNameWithoutExtension(WebUtility.HtmlEncode(fileInput.FileName)));
            var length = (int)fileInput.Length;
            var contentType = fileInput.ContentType;
            using var mem = new MemoryStream(length);
            await fileInput.CopyToAsync(mem);
            var data = mem.ToArray();

            return await SaveFileAsync(fileName, length, contentType, altContentType, data, tagsString, copyright, copyrightDate, fileID);
        }

        public async Task<File> SaveFileAsync(string fileName, int length, string contentType, string? altContentType, byte[] data, string tagsString, string copyright, DateOnly copyrightDate, int? fileID = null)
        {
            File? file = null;

            if (fileID is null)
            {
                file = new File
                {
                    Name = fileName
                };
                Files.Add(file);
            }
            else
            {
                file = await Files
                    .Include(f => f.Tags)
                    .Include(f => f.FileContent)
                    .SingleOrDefaultAsync(f => f.Id == fileID.Value);

                if (file is null)
                {
                    throw new FileNotFoundException($"Could not find a file for ID {fileID}");
                }
            }

            if (fileID is null && !string.IsNullOrWhiteSpace(tagsString))
            {
                var tagNames = tagsString.SplitX(',')
                    .Select(t => t.Trim().ToLowerInvariant())
                    .Where(t => t.Length > 0);

                var tags = FileTags
                    .ToDictionary(t => t.Name);

                foreach (var tagName in tagNames)
                {
                    var tag = tags.ContainsKey(tagName)
                        ? tags[tagName]
                        : new FileTag { Name = tagName };

                    file.Tags.Add(tag);
                }
            }

            file.AltMime = altContentType;
            file.Copyright = Uri.UnescapeDataString(copyright.Trim());
            file.CopyrightDate = copyrightDate;
            file.CreatedOn = DateTime.UtcNow;

            if (string.IsNullOrEmpty(contentType)
                || contentType == MediaType.Application_Octet_Stream)
            {
                var guesses = MediaType.GuessByFileName(fileName);
                contentType = guesses.Count > 0
                    ? guesses[0]
                    : MediaType.Application_Octet_Stream;
            }

            file.Size = length;
            file.Mime = contentType;

            file.FileContent ??= new FileContent();
            file.FileContent.Data = data;

            return file;
        }

        public Task<File?> GetFileAsync(int fileID) =>
            Files.SingleOrDefaultAsync(f => f.Id == fileID);

        public async Task<string> GetFileAsText(int fileID)
        {
            var data = await FileContents
                .Where(f => f.FileId == fileID)
                .Select(f => f.Data)
                .SingleAsync();
            return Encoding.UTF8.GetString(data);
        }

        public async Task<IActionResult> GetFileContent(int fileID, string range, int cacheTime = 0, ILogger logger = null)
        {
            var file = await GetFileAsync(fileID);

            if (file is null)
            {
                throw new FileNotFoundException();
            }

            var type = MediaType.Parse(file.Mime);
            var fileName = type.AddExtension(file.Name);
            return new DbFileResult(Database, file.Size, file.Mime, fileName, cacheTime, range, logger, (cmd) =>
            {
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.CommandText = "select \"Data\" from \"FileContents\" where \"FileID\" = @FileID";
                var pFileID = cmd.CreateParameter();
                pFileID.ParameterName = "FileID";
                pFileID.Value = file.Id;
                cmd.Parameters.Add(pFileID);
            });
        }

        public async Task DeleteFileAsync(int fileID)
        {
            var file = await Files
                .Include(f => f.Tags)
                .Include(f => f.GsvMetadatum)
                .Include(f => f.FileContent)
                .SingleOrDefaultAsync(f => f.Id == fileID);

            if (file is null)
            {
                throw new FileNotFoundException();
            }

            if (file.GsvMetadatum is not null)
            {
                GsvMetadata.Remove(file.GsvMetadatum);
            }

            if (file.FileContent is not null)
            {
                FileContents.Remove(file.FileContent);
            }

            Files.Remove(file);

            await SaveChangesAsync();
        }

        public async Task<int> SavePhotosphereAsync(IFormFile file, string pano, float latitude, float longitude, string copyright, DateOnly date, int? fileID = null)
        {
            var fileInfo = await SaveFileAsync(
                file,
                null,
                "photosphere",
                copyright,
                date,
                fileID);

            var sphere = await GsvMetadata
                .SingleOrDefaultAsync(gsvm => gsvm.FileId == fileID);

            if (sphere is null)
            {
                sphere = new GsvMetadatum
                {
                    Pano = pano,
                    FileId = fileInfo.Id,
                    Latitude = latitude,
                    Longitude = longitude,
                };
                sphere.File = fileInfo;
                GsvMetadata.Add(sphere);
            }

            sphere.Latitude = latitude;
            sphere.Longitude = longitude;

            await SaveChangesAsync();

            return fileInfo.Id;
        }

        public async Task<File> CreateFileAsync(FileCreateInput fileUpload)
        {
            var file = await SaveFileAsync(
                fileUpload.FormFile,
                fileUpload.AltContentType,
                fileUpload.TagString,
                fileUpload.Copyright,
                fileUpload.CopyrightDate.ToDateOnly());

            await SaveChangesAsync();

            return file;
        }
    }
}
