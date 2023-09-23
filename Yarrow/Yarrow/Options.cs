using Juniper;

namespace Yarrow
{
    public static class Options
    {
        public static readonly MediaType.Video Video_Vnd_DlsDc_YtDlp_Json = new("vnd.dlsdc.ytdlp+json", "ytdlp.json", "ytdlp", "json");
        public static readonly MediaType.Image Image_Vendor_Google_StreetView_Pano = new("vnd.google.streetview.pano");
    }
}