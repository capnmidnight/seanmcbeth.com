namespace Yarrow.Data
{
    public interface IMediaAsset : IAsset
    {
        public float Volume { get; }
        public bool? Enabled { get; }
        public string Label { get; }
    }
}
