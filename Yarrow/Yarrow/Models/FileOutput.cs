using Yarrow.Data;

namespace Yarrow.Models
{
    public class FileOutput
    {
        public int ID { get; }
        public string Name { get; }
        public string MediaType { get; }
        public string FilePath { get; }
        public string TagsString { get; }
        public string Copyright { get; }
        public DateTime? CopyrightDate { get; }
        public int Size { get; }
        public string SizeString { get; }
        public DateTime CreatedOn { get; }

        public FileOutput(Data.File data)
        {
            ID = data.Id;
            Name = data.Name;
            MediaType = data.AltMime ?? data.Mime;
            Size = data.Size;
            SizeString = data.AltMime is not null
                ? "--"
                : Juniper.Units.FileSize.Format(Size);
            FilePath = data.Path();
            TagsString = data.Tags
                .OrderBy(t => t.Name)
                .Select(t => t.Name)
                .ToString(", ");
            Copyright = data.Copyright;
            CopyrightDate = data.CopyrightDate?.ToDateTime(TimeOnly.MinValue);
            CreatedOn = data.Timestamp;
        }
    }
}
