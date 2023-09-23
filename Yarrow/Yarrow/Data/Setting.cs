using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<Setting> Settings { get; set; }
    }

    public partial class Setting
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Setting>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("Settings_pkey");

                entity.Property(e => e.Value).IsRequired();
            });
        }

        public string Name { get; set; }
        public string Value { get; set; }
    }
}
