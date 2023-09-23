using static Juniper.XR.SphereEncoding;
using static Juniper.XR.StereoLayout;

namespace Yarrow.Models
{
    public class VideoClipUpdateInput
    {
        public int ID { get; set; }
        public bool Enabled { get; set; }
        public string Label { get; set; }
        public float Volume { get; set; }
        public bool Proxied { get; set; }
        public string SphereEncodingName { get; set; }
        public string StereoLayoutName { get; set; }
        public string FileName { get; set; }

        public SphereEncodingKind SphereEncoding => NameSphereEncodings[SphereEncodingName
            ?? SphereEncodingNames[SphereEncodingKind.None]];

        public StereoLayoutKind StereoLayout => NameStereoLayouts[StereoLayoutName
            ?? StereoLayoutNames[StereoLayoutKind.None]];
    }
}
