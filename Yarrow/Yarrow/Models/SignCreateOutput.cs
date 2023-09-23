using Yarrow.Data;

namespace Yarrow.Models
{
    public class SignCreateOutput
    {
        public SignOutput Sign { get; }
        public TransformOutput Transform { get; }
        public SignCreateOutput(Sign sign)
        {
            Sign = new SignOutput(sign.Transform.Scenario, sign);
            Transform = new TransformOutput(sign.Transform);
        }
    }
}
