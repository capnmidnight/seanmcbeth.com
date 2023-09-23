namespace Yarrow.Data
{
    public interface IFileReference
    {
        public int FileId { get; }
        public File File { get; }
    }

    public static class IFileReferenceExt
    {
        public static string Path(this File file)
        {
            return $"/vr/file/{file.Id}";
        }
    }
}
