// Ignore Spelling: Nullable

namespace Yarrow.Data
{
    public interface INullableFileReference
    {
        public int? FileId { get; }
        public File? File { get; }
    }

    public static class INullableFileReferenceExt
    {
        public static string? FilePath(this INullableFileReference fileRef)
        {
            if (fileRef is null
                || fileRef.FileId is null
                || fileRef.FileId == 0)
            {
                return null;
            }

            return $"/vr/file/{fileRef.FileId}";
        }
    }
}
