using Juniper.Services;

using Microsoft.AspNetCore.HttpLogging;

using Juniper.Azure;

using OpenAI.GPT3.Extensions;

using SeanMcBeth.Services;

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
        private BuildSystem? build;
#endif

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            config = configuration;
            env = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var config = new DefaultConfiguration.Options();

            services.ConfigureDefaultServices(env, config)
                .AddSingleton(new HttpClient(new HttpClientHandler
                {
                    AllowAutoRedirect = false,
                    UseCookies = false
                }))
                .AddTransient<ISpeechService, AzureSpeechService>()
                .AddOpenAIService(settings =>
                {
                    settings.ApiKey = this.config.GetOpenAIKey();
                }); ;

            if (env.IsDevelopment())
            {
#if DEBUG
                try
                {
                    build = new BuildSystem(BuildConfig.GetBuildConfig());
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
        public void Configure(IApplicationBuilder app, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseIPBanList("::ffff:10.20.22.108");
            }

            app.ConfigureRequestPipeline(env, config, logger, Program.ports)
                .UseHttpLogging();
        }
    }
}
