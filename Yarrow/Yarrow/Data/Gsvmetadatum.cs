// Ignore Spelling: Gsv Metadatum Metadata Pano

using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public DbSet<GsvMetadatum> GsvMetadata { get; set; }
    }

    public partial class GsvMetadatum
    {
        [Key]
        [ForeignKey(nameof(File))]
        public required int FileId { get; set; }

        [DeleteBehavior(DeleteBehavior.Cascade)]
        public File? File { get; set; }

        public required string Pano { get; set; }
        public required float Latitude { get; set; }
        public required float Longitude { get; set; }
    }
}
