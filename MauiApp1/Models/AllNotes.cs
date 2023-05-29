using System.Collections.ObjectModel;

namespace MauiApp1.Models
{
    internal class AllNotes
    {
        public ObservableCollection<Note> Notes { get; } = new ObservableCollection<Note>();

        public AllNotes()
        {
            LoadNotes();
        }

        public void LoadNotes()
        {
            Notes.Clear();
            var appDataPath = FileSystem.AppDataDirectory;
            var notes = from filename in Directory.EnumerateFiles(appDataPath, "*.notes.txt")
                        let note = new Note(filename)
                        orderby note.Date
                        select note;

            foreach(var note in notes)
            {
                Notes.Add(note);
            }
        }
    }
}
