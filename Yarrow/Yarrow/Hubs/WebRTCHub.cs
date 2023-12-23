using Juniper.Server.WebRTC;

using Yarrow.Data;

namespace Yarrow.Hubs
{
    public class WebRTCHub : AbstractWebRTCHub<IWebRTCHubClient>
    {
        private readonly YarrowContext db;

        public WebRTCHub(YarrowContext db, ILogger<WebRTCHub> logger)
            : base(logger)
        {
            this.db = db;
        }

        protected override string[] IceTypes =>
            db.Settings
                .SingleOrDefault(s => s.Name == YarrowContext.ICE_TYPES)
                .Value
                .SplitX(',');

        protected override string CoTURNSecret =>
            db.Settings
                .Single(s => s.Name == YarrowContext.COTURN_SECRET)
                .Value;

        protected override IEnumerable<Uri> TurnServers =>
            db.WebRTCSettings
                .Where(w => w.Enabled != false)
                .AsEnumerable()
                .Select(w => new UriBuilder(w.Protocol, w.Host, w.Port).Uri);
    }
}
