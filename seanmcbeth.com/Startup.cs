using Juniper.Services;

using Microsoft.AspNetCore.HttpLogging;

using Juniper.Azure;

using OpenAI.GPT3.Extensions;
using Juniper.World.GIS.Google;
using Juniper.IO;

#if DEBUG
using Juniper.TSBuild;
#endif


namespace SeanMcBeth
{
    public class Startup
    {
        private readonly IWebHostEnvironment env;
        private readonly IConfiguration config;
#if DEBUG
        private BuildSystem<BuildConfig>? build;
#endif

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            config = configuration;
            env = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var http = new HttpClient(new HttpClientHandler
            {
                AllowAutoRedirect = false,
                UseCookies = false
            });

            services.ConfigureDefaultJuniperServices(env, config)
                .AddSingleton(http);

            var azureSubscriptionKey = config.GetValue<string>("Azure:Speech:SubscriptionKey");
            var azureRegion = config.GetValue<string>("Azure:Speech:Region");
            if (azureSubscriptionKey is not null
                && azureRegion is not null)
            {
                services.AddTransient<ISpeechService>(provider =>
                    new SpeechService(azureSubscriptionKey, azureRegion));
            }

            var openAIKey = config.GetValue<string>("OpenAI:APIKey");
            if (openAIKey is not null)
            {
                services.AddOpenAIService(settings =>
                    settings.ApiKey = openAIKey);
            }


            var googleMapsAPIKey = config.GetValue<string>("Google:APIKey");
            var googleMapsSigningKey = config.GetValue<string>("Google:SigningKey");
            if(googleMapsAPIKey is not null
                && googleMapsSigningKey is not null)
            {
                services.AddTransient<IGoogleMapsStreamingClient>(provider =>
                    new GoogleMapsStreamingClient(http, googleMapsAPIKey, googleMapsSigningKey, CachingStrategy.GetNoCache()));
            }

            if (env.IsDevelopment())
            {
#if DEBUG
                try
                {
                    build = new BuildSystem<BuildConfig>();
                    build.Watch();
                }
                catch (BuildSystemProjectRootNotFoundException exp)
                {
                    Console.WriteLine("WARNING: {0}", exp.Message);
                }
#endif

                services.AddHttpLogging(opts =>
                {
                    opts.LoggingFields = HttpLoggingFields.All;
                    opts.RequestHeaders.Add("host");
                    opts.RequestHeaders.Add("user-agent");
                });
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, ILogger<Startup> logger) => 
            app.ConfigureJuniperRequestPipeline(env, config, logger)
                .UseHttpLogging();
    }
}
