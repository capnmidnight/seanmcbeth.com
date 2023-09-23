using Yarrow.Data;

namespace Yarrow.Models
{
    public class ModelCreateOutput
    {
        public ModelOutput Model { get; }
        public TransformOutput Transform { get; }
        public ModelCreateOutput(Model model)
        {
            Model = new ModelOutput(model.Transform.Scenario, model);
            Transform = new TransformOutput(model.Transform);
        }
    }
}
