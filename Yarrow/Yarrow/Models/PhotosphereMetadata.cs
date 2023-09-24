using Yarrow.Data;

namespace Yarrow.Models
{
    public class PhotosphereMetadata : Juniper.World.GIS.Google.StreetView.MetadataResponse
    {
        public int FileID { get; }
        public string FileName { get; }

        public PhotosphereMetadata(GsvMetadatum data)
            : base(data.Pano, data.Latitude, data.Longitude, data.File.Copyright, data.File.CopyrightDate.ToDateTime(TimeOnly.MinValue))
        {
            FileID = data.FileId;
            FileName = data.File.Name;
        }
    }
}
