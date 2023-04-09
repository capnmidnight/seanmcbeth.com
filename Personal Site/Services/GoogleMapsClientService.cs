using Juniper.Configuration;
using Juniper.IO;
using Juniper.World.GIS.Google;

namespace SeanMcBeth.Services
{
    public class GoogleMapsClientService : GoogleMapsStreamingClient
    {
        public GoogleMapsClientService(IConfiguration config, HttpClient http)
            : base(http, config.GetGoogleAPIKey(), config.GetGoogleSigningKey(), CachingStrategy.GetNoCache())
        {

        }
    }
}
