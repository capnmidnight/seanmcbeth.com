namespace Yarrow.Data
{
    public partial class Scenario : ICategory
    {
        public string Name => ScenarioGroup?.Name;
    }
}
