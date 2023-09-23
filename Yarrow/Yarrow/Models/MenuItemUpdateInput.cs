namespace Yarrow.Models
{
    public class MenuItemUpdateInput
    {
        public int ID { get; set; }
        public int Order { get; set; }
        public string Label { get; set; }
        public int? ParentID { get; set; }
        public bool Enabled { get; set; }
        public bool Visible { get; set; }
        public int? FileID { get; set; }
        public int? ScenarioGroupID { get; set; }
    }
}