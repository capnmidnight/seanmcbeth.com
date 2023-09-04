using Juniper.Data;
using Juniper.Data.SqlLite;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

using MauiApp1.Models;

namespace MauiApp1;

public static partial class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        var dbFile = Path.Combine(FileSystem.AppDataDirectory, "Notes.db");
        builder.Services.AddJuniperDatabase<Sqlite, NotesContext>($"Data Source={dbFile}", builder.Configuration.GetValue<bool>("DetailedErrors"));
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

#if DEBUG
		builder.Logging.AddDebug();
#endif

        var app = builder.Build();
        app.Services.MigrateDatabase<NotesContext>();
        return app;
    }
}