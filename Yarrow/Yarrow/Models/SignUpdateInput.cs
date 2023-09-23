namespace Yarrow.Models
{
    public class SignUpdateInput
    {
        public int ID { get; set; }
        public bool IsCallout { get; set; }
        public bool AlwaysVisible { get; set; }
        public string FileName { get; set; }
    }
}
