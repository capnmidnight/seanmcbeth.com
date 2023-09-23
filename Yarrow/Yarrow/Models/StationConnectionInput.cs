namespace Yarrow.Models
{
    public class StationConnectionInput
    {
        public int FromStationID { get; set; }
        public int ToStationID { get; set; }
    }
    public class StationConnectionUpdateInput : StationConnectionInput
    {
        public int TransformID { get; set; }
        public string Label { get; set; }
    }
}
