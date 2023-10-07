using Juniper.Data;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext : IdentityDbContext
    {
        public YarrowContext()
        {
        }

        public YarrowContext(DbContextOptions<YarrowContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlite("name=ConnectionStrings:Yarrow");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.JuniperModelCreating<YarrowContext>();
        }
    }
}
