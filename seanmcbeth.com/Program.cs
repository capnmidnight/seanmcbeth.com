using Juniper.Services;

namespace SeanMcBeth
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args)
                .Build()
                .Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureJuniperHost<Startup>();
        }
    }
}
