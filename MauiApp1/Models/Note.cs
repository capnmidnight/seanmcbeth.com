using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;

namespace MauiApp1.Models;

internal class Note
{
    [Key] 
    public int Id { get; set; }

    [Required]
    public string Text { get; set; }

    [Required]
    public DateTime? Date { get; set; }

    internal static void Configure(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Note>()
            .Property(x => x.Date)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}
