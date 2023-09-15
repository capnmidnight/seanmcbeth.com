﻿using Juniper.Data;

using MauiApp1.Models;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MauiApp1;

public static partial class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder.Services.AddJuniperDatabase<Sqlite, NotesContext>(NotesContext.DefaultConnectionString, builder.Configuration.GetValue<bool>("DetailedErrors"));
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