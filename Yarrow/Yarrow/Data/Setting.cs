using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Setting> Settings { get; set; }
    }

    public partial class Setting
    {
        [Key]
        public required string Name { get; set; }
        public required string Value { get; set; }
    }
}
