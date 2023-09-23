using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public virtual DbSet<MenuItem> MenuItems { get; set; }
    }

    public partial class MenuItem
    {
        internal static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuItem>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.Label)
                    .IsRequired()
                    .HasColumnType("character varying");

                entity.Property(e => e.ParentId).HasColumnName("ParentID");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.MenuItems)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_MenuItem_File");

                entity.HasIndex(e => e.FileId, "IX_MenuItems_FileID");
                entity.HasIndex(e => new { e.Id, e.FileId }, "IDX_MenuItems__ID_FileID");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.InverseParent)
                    .HasForeignKey(d => d.ParentId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_MenuItem_Parent");

                entity.HasIndex(e => e.ParentId, "IX_MenuItems_ParentID");
                entity.HasIndex(e => new { e.Id, e.ParentId }, "IDX_MenuItems__ID_ParentID");

                entity.HasOne(d => d.ScenarioGroup)
                    .WithMany(p => p.MenuItems)
                    .HasForeignKey(d => d.ScenarioGroupId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_MenuItem_ScenarioGroup");

                entity.HasIndex(e => e.ScenarioGroupId, "IX_MenuItems_ScenarioGroupID");
                entity.HasIndex(e => new { e.Id, e.ScenarioGroupId }, "fki_FK_MenuItem_ScenarioGroup");

                entity.HasOne(d => d.Organization)
                    .WithMany(p => p.MenuItems)
                    .HasForeignKey(d => d.OrganizationId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_MenuItem_Organization");
            });
        }

        public MenuItem()
        {
            InverseParent = new HashSet<MenuItem>();
        }

        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int Order { get; set; }
        public string Label { get; set; }
        public int? FileId { get; set; }
        public int? ScenarioGroupId { get; set; }
        public int OrganizationId { get; set; }

        public virtual File File { get; set; }
        public virtual MenuItem Parent { get; set; }
        public virtual ScenarioGroup ScenarioGroup { get; set; }
        public virtual Organization Organization { get; set; }
        public virtual ICollection<MenuItem> InverseParent { get; set; }
    }
}
