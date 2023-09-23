namespace Yarrow.Models
{
    public class SearchOutput
    {
        public FileOutput[] Files { get; set; }
        public int Total { get; set; }
        public int PageSize { get; set; }
        public int Index { get; set; }
    }
}
