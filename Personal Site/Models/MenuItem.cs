namespace SeanMcBeth.Models
{
    public record MenuItem(string Text, string Label, string Target, bool Hide = false, string? Rel = null);
}
