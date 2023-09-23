namespace Yarrow.Models
{
    public class TextUpdateInput
    {
        public int ID { get; set; }
        public bool IsCallout { get; set; }
        public bool AlwaysVisible { get; set; }
        public string FileName { get; set; }
        public string Text { get; set; }
    }
}
