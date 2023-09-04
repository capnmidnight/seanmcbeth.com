using Juniper.Data;
using Juniper.Data.SqlLite;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace MauiApp1.Models;

internal class NotesContext : DbContext
{
    public DbSet<Note> Notes { get; set; }

    static NotesContext()
    {
        SQLitePCL.Batteries_V2.Init();
    }

    public NotesContext()
    {

        //Database.EnsureCreated();
    }

    public NotesContext(DbContextOptions<NotesContext> options)
        : base(options)
    {
    }

    public static string DefaultConnectionString
    {
        get
        {
            //var dbFile = Path.Combine(FileSystem.AppDataDirectory, "Notes.db");
            //return $"Data Source={PathExt.Abs2Rel(dbFile)}";
            return $"Data Source=Notes.db";
        }
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.AddJuniperDatabase<Sqlite>(DefaultConnectionString, true);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        Note.Configure(modelBuilder);
    }
}