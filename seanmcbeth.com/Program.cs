using Juniper.Azure;
using Juniper.Services;

using OpenAI.Extensions;

var builder = WebApplication
    .CreateBuilder(args)
    .ConfigureBuildSystem<SeanMcBeth.BuildConfig>()
    .ConfigureJuniperWebApplication();

var http = new HttpClient(new HttpClientHandler
{
    AllowAutoRedirect = false,
    UseCookies = false
});

builder.Services.AddSingleton(http);

var azureSubscriptionKey = builder.Configuration.GetValue<string>("Azure:Speech:SubscriptionKey");
var azureRegion = builder.Configuration.GetValue<string>("Azure:Speech:Region");
if (azureSubscriptionKey is not null
    && azureRegion is not null)
{
    builder.Services.AddTransient<ISpeechService>(provider =>
        new SpeechService(azureSubscriptionKey, azureRegion));
}

var openAIKey = builder.Configuration.GetValue<string>("OpenAI:APIKey");
if (openAIKey is not null)
{
    builder.Services.AddOpenAIService(settings =>
        settings.ApiKey = openAIKey);
}

var app = builder
    .Build()
    .ConfigureJuniperRequestPipeline();

await app.BuildReady();
await app.RunAsync();