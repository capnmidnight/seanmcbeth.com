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
                optionsBuilder.UseNpgsql("name=ConnectionStrings:Yarrow");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            Log.Configure(modelBuilder);
            AudioTrack.Configure(modelBuilder);
            File.Configure(modelBuilder);
            FileContent.Configure(modelBuilder);
            FileTag.Configure(modelBuilder);
            Gsvmetadatum.Configure(modelBuilder);
            Headset.Configure(modelBuilder);
            HeadsetLocation.Configure(modelBuilder);
            Language.Configure(modelBuilder);
            MenuItem.Configure(modelBuilder);
            Data.Model.Configure(modelBuilder);
            Organization.Configure(modelBuilder);
            Report.Configure(modelBuilder);
            Room.Configure(modelBuilder);
            Scenario.Configure(modelBuilder);
            ScenarioGroup.Configure(modelBuilder);
            Setting.Configure(modelBuilder);
            Sign.Configure(modelBuilder);
            Station.Configure(modelBuilder);
            StationConnection.Configure(modelBuilder);
            Transform.Configure(modelBuilder);
            UserProfile.Configure(modelBuilder);
            VideoClip.Configure(modelBuilder);
            WebRtc.Configure(modelBuilder);

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
