using Juniper.Data;
using Juniper.Data.SqlLite;

using Microsoft.EntityFrameworkCore;

namespace MauiApp1.Models;

internal class NotesContext : DbContext
{
    public DbSet<Note> Notes { get; set; }

    public NotesContext()
    {
        SQLitePCL.Batteries_V2.Init();

        Database.EnsureCreated();
    }

    public NotesContext(DbContextOptions<NotesContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var dbFile = Path.Combine(FileSystem.AppDataDirectory, "Notes.db");
            optionsBuilder.AddJuniperDatabase<Sqlite>($"Data Source={dbFile}", true);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        Note.Configure(modelBuilder);
    }
}