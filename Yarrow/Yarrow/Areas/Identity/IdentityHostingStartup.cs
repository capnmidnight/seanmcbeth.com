[assembly: HostingStartup(typeof(Yarrow.Areas.Identity.IdentityHostingStartup))]
namespace Yarrow.Areas.Identity
{
    public class IdentityHostingStartup : IHostingStartup
    {
        public void Configure(IWebHostBuilder builder)
        {
            builder.ConfigureServices((context, services) =>
            {
            });
        }
    }
}