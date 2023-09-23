namespace Yarrow.Models
{
    public class TransformInput
    {
        public string Name { get; set; }
        public float[] Matrix { get; set; }
        public int ParentTransformID { get; set; }
    }
}
