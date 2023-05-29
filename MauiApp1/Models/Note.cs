namespace MauiApp1.Models
{
    internal class Note
    {
        public string Filename { get; }
        public string Text { get; }
        public DateTime Date { get; }

        public Note(string filename)
        {
            Filename = filename;

            if (File.Exists(filename))
            {
                Date = File.GetCreationTime(Filename);
                Text = File.ReadAllText(Filename);
            }
        }

        internal void Save(string text)
        {
            File.WriteAllText(Filename, text);
        }

        internal void Delete()
        {
            if (File.Exists(Filename))
            {
                File.Delete(Filename);
            }
        }
    }
}
