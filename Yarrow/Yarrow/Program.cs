using Juniper;
using Juniper.Azure;
using Juniper.Data;
using Juniper.World.GIS.Google;

using Microsoft.AspNetCore.Identity;

using Yarrow;
using Yarrow.Data;

await WebApplication.CreateBuilder(args)
    .UseSystemd()
    .AddJuniperServices()
    .AddJuniperDatabase<YarrowContext>(new DefaultSqlite("Yarrow"), "Name=Yarrow")
    .AddJuniperBuildSystem<BuildConfig>()
    .AddHttpClient("HTTP")
    .AddJuniperSpeechService()
    .AddJuniperGoogleMaps()
    .Build()
    .MigrateDatabase<YarrowContext>()
    .SeedData<YarrowContext>(true)
    .UseJuniperRequestPipeline()
    .BuildAndRunAsync();

static class YarrowDataSeeder
{
    [DataSeeder]
    public static void Import(IServiceProvider services, YarrowContext db, ILogger<YarrowContext> logger)
    {
        var roles = services.GetRequiredService<RoleManager<IdentityRole>>();
        var users = services.GetRequiredService<UserManager<IdentityUser>>();
        db.SeedData(roles, users, logger);
    }
}