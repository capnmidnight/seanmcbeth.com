using Juniper;

using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public abstract class AbstractFileAsset
    {
        public int FileID { get; }
        public string FileName { get; }
        public string FilePath { get; }
        public string FileTagString { get; }
        public string MediaType { get; }
        public string TrueMediaType { get; }
        public string Copyright { get; }
        public DateTime? CopyrightDate { get; }

        [JsonConstructor]
        protected AbstractFileAsset(
            int fileID,
            string fileName,
            string filePath,
            string fileTagString,
            string mediaType,
            string trueMediaType,
            string copyright,
            DateTime? copyrightDate)
        {
            FileID = fileID;
            FileName = fileName;
            FilePath = filePath;
            FileTagString = fileTagString;
            MediaType = mediaType;
            TrueMediaType = trueMediaType;
            Copyright = copyright;
            CopyrightDate = copyrightDate;
        }

        protected AbstractFileAsset(IFileReference asset)
            : this(
                  asset.FileId,
                  asset.File.Name,
                  asset.File.Path(),
                  asset.File.Tags
                    ?.Select(t => t?.Name)
                    ?.Where(n => !string.IsNullOrEmpty(n))
                    ?.OrderBy(Always.Identity)
                    ?.ToString(",")
                    ?? "",
                  asset.File.AltMime ?? asset.File.Mime,
                  asset.File.Mime,
                  asset.File.Copyright,
                  asset.File.CopyrightDate?.ToDateTime(TimeOnly.MinValue))
        {
        }

        protected AbstractFileAsset(SerializationInfo info, StreamingContext context)
            : this(
                info.GetInt32(nameof(FileID)),
                info.GetString(nameof(FileName)),
                info.GetString(nameof(FilePath)),
                info.GetString(nameof(FileTagString)),
                info.GetString(nameof(MediaType)),
                info.GetString(nameof(TrueMediaType)),
                info.GetString(nameof(Copyright)),
                info.GetDateTime(nameof(CopyrightDate)))
        {
        }
    }
}