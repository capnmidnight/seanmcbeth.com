using Juniper.Configuration;

namespace SeanMcBeth.Services
{
    public class AzureSpeechService : Juniper.Azure.SpeechService
    {

        public AzureSpeechService(IConfiguration config)
            : base(config.GetAzureSubscriptionKey(), config.GetAzureRegion())
        {
        }

    }
}
