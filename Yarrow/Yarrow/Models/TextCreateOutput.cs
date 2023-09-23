using Yarrow.Data;

namespace Yarrow.Models
{
    public class TextCreateOutput
    {
        public TextOutput Text { get; }
        public TransformOutput Transform { get; }
        public TextCreateOutput(Text text)
        {
            Text = new TextOutput(text.Transform.Scenario, text);
            Transform = new TransformOutput(text.Transform);
        }
    }
}
