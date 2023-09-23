namespace Yarrow.Models
{
    public abstract class AbstractValueReport<T> where T : AbstractScenarioFileAsset
    {
        public T Value { get; }

        public int ID => Value.TransformID;

        public abstract string Name { get; }

        protected AbstractValueReport(T value)
        {
            Value = value;
        }
    }
}
