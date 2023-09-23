namespace Yarrow.Models
{
    public class EmojiOutput
    {
        public string Value { get; }
        public string Desc { get; }

        public EmojiOutput(string value, string desc)
        {
            Value = value;
            Desc = desc;
        }
    }
}
