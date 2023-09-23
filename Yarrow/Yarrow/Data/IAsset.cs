namespace Yarrow.Data
{
    public interface IAsset : IFileReference
    {
        public int Id { get; }
        public int TransformId { get; }

        public Transform Transform { get; }
    }
}
