using Juniper.Azure;
using Juniper.Data;
using Juniper.Services;
using Juniper.TSBuild;
using Juniper.World.GIS.Google;

using Microsoft.AspNetCore.Identity;

using Yarrow;
using Yarrow.Data;

var app = WebApplication.CreateBuilder(args)
    .UseSystemd()
    .ConfigureJuniperWebApplication()
    .ConfigureJuniperDatabase<Sqlite, YarrowContext>("Name=Yarrow")
    .AddJuniperBuildSystem<BuildConfig>()
    .AddJuniperHTTPClient()
    .ConfigureJuniperSpeechService()
    .ConfigureJuniperGoogleMaps()
    .Build()
    .MigrateDatabase<YarrowContext>();

await app.ImportDataAsync(args, generator: new YarrowDataSeeder());

await app.ConfigureJuniperRequestPipeline()
    .BuildAndRunAsync();

class YarrowDataSeeder : IDataGenerator<YarrowContext>
{
    public void Import(IServiceProvider services, YarrowContext db, ILogger logger)
    {
        var roles = services.GetRequiredService<RoleManager<IdentityRole>>();
        var users = services.GetRequiredService<UserManager<IdentityUser>>();
        db.SeedData(roles, users, logger);
    }
}