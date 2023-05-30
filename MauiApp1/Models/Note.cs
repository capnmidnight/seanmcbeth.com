namespace MauiApp1.Models
{
    internal class Note
    {
        public string Filename { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }

        public Note()
        {
            Filename = $"{Path.GetRandomFileName()}.notes.txt";
            Date = DateTime.Now;
            Text = "";
        }

        private string FullPath =>
            Path.Combine(FileSystem.AppDataDirectory, Filename);

        public async Task SaveAsync()
        {
            await File.WriteAllTextAsync(FullPath, Text);
        }

        public void Delete()
        {
            if (File.Exists(FullPath))
            {
                File.Delete(FullPath);
            }
        }

        public static Note Load(string filename)
        {
            var fullPath = Path.Combine(FileSystem.AppDataDirectory, filename);

            if (!File.Exists(fullPath))
            {
                throw new FileNotFoundException("Unable to find file on local storage", filename);
            }

            return new ()
            {
                Filename = filename,
                Date = File.GetCreationTime(fullPath),
                Text = File.ReadAllText(fullPath),
            };
        }

        public static IEnumerable<Note> LoadAll()
        {
            var appDataPath = FileSystem.AppDataDirectory;
            return from filename in Directory.EnumerateFiles(appDataPath, "*.notes.txt")
                   let note = Load(Path.GetFileName(filename))
                   orderby note.Date
                   select note;
        }
    }
}
