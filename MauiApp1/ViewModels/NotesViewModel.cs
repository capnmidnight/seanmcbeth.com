using CommunityToolkit.Mvvm.Input;

using MauiApp1.Models;

using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;

namespace MauiApp1.ViewModels
{
    internal class NotesViewModel : IQueryAttributable
    {
        private readonly NotesContext db;

        public ObservableCollection<NoteViewModel> AllNotes { get; }
        public ICommand NewCommand { get; }
        public ICommand SelectNoteCommand { get; }

        public NotesViewModel()
        {
            db = new NotesContext();
            AllNotes = new(db.Notes.Select(n => new NoteViewModel(n)));
            NewCommand = new AsyncRelayCommand(NewNoteAsync);
            SelectNoteCommand = new AsyncRelayCommand<NoteViewModel>(SelectNoteAsync);
        }

        private async Task NewNoteAsync()
        {
            await Shell.Current.GoToAsync(nameof(Views.NotePage));
        }

        private async Task SelectNoteAsync(NoteViewModel note)
        {
            if (note != null)
            {
                await Shell.Current.GoToAsync($"{nameof(Views.NotePage)}?load={note.Identifier}");
            }
        }
        void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
        {
            var idStr = query.ContainsKey("deleted")
                    ? query["deleted"]
                    : query.ContainsKey("saved")
                        ? query["saved"]
                        : throw new Exception("No ID");

            if (int.TryParse(idStr.ToString(), out var noteId))
            {
                if (query.ContainsKey("deleted"))
                {
                    var matchedNote = AllNotes
                        .Where((n) => n.Identifier == noteId)
                        .FirstOrDefault();

                    // If note exists, delete it
                    if (matchedNote != null)
                    {
                        AllNotes.Remove(matchedNote);
                    }
                }
                else if (query.ContainsKey("saved"))
                {
                    var matchedNote = AllNotes
                        .Where((n) => n.Identifier == noteId)
                        .FirstOrDefault();

                    // If note is found, update it
                    if (matchedNote != null)
                    {
                        matchedNote.Reload();
                        AllNotes.Move(AllNotes.IndexOf(matchedNote), 0);
                    }

                    // If note isn't found, it's new; add it.
                    else
                    {
                        var note = db.Notes.SingleOrDefault(n => n.Id == noteId);
                        AllNotes.Insert(0, new NoteViewModel(note));
                    };
                }
            }
        }
    }
}