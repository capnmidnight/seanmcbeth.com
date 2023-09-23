using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<UserProfile> UserProfiles { get; set; }
    }

    public partial class UserProfile : IDisposable
    {
        private bool disposedValue;

        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.ToTable("UserProfiles");

                entity.Property(e => e.FullName)
                    .IsRequired();

                entity.Property(e => e.DisplayName)
                    .IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasDefaultValueSql("now()");

                entity.HasOne(d => d.User)
                    .WithOne()
                    .HasForeignKey<UserProfile>(d => d.UserId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_UserProfiles_AspNetUsers");

                entity.HasIndex(d => d.UserId);

                entity.HasOne(d => d.Room)
                    .WithMany(p => p.Users)
                    .HasForeignKey(p => p.RoomID)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(d => d.RoomID);

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.Users)
                    .HasForeignKey(p => p.OrganizationID)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(d => d.OrganizationID);

                entity.HasOne(d => d.Headset)
                    .WithOne(d => d.HeadsetUser)
                    .HasForeignKey<UserProfile>(d => d.HeadsetId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasIndex(d => d.HeadsetId);
                entity.HasIndex(d => new { d.UserId, d.HeadsetId });
            });
        }

        public UserProfile()
        {
            ScenarioGroups = new HashSet<ScenarioGroup>();
            CreatedScenarios = new HashSet<Scenario>();
            PublishedScenarios = new HashSet<Scenario>();
            Logs = new HashSet<Log>();
            Reports = new HashSet<Report>();
        }

        public string UserId { get; set; }
        public string FullName { get; set; }
        public string DisplayName { get; set; }
        public string HeadsetId { get; set; }
        public int? OrganizationID { get; set; }
        public int? RoomID { get; set; }
        public DateTime? Timestamp { get; set; }

        public virtual IdentityUser User { get; set; }
        public virtual UserProfile Headset { get; set; }
        public virtual UserProfile HeadsetUser { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual Room Room { get; set; }

        public virtual IEnumerable<ScenarioGroup> ScenarioGroups { get; set; }
        public virtual IEnumerable<Scenario> CreatedScenarios { get; set; }
        public virtual IEnumerable<Scenario> PublishedScenarios { get; set; }
        public virtual IEnumerable<Log> Logs { get; set; }
        public virtual IEnumerable<Report> Reports { get; set; }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    if (Logs is not null)
                    {
                        foreach (var log in Logs)
                        {
                            log.Dispose();
                        }
                    }
                }

                // TODO: free unmanaged resources (unmanaged objects) and override finalizer
                // TODO: set large fields to null
                disposedValue = true;
            }
        }

        public void Dispose()
        {
            // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}
