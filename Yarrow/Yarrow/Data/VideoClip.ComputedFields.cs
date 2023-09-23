using static Juniper.XR.SphereEncoding;
using static Juniper.XR.StereoLayout;

namespace Yarrow.Data
{
    public partial class VideoClip
    {
        public bool IsEnabled => Enabled == true;
        public string StereoLayoutName => StereoLayoutNames[StereoLayout];
        public string SphereEncodingName => SphereEncodingNames[SphereEncoding];
    }
}
