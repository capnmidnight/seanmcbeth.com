namespace Yarrow.Data
{
    public partial class ScenarioSnapshot : ICategory
    {
        public string? Name => ScenarioGroup?.Name;
    }
}
