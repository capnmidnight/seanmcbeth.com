using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

using MauiApp1.Models;

using System.ComponentModel;
using System.Windows.Input;

namespace MauiApp1.ViewModels
{
    internal class NoteViewModel : ObservableObject, IQueryAttributable
    {
        private Note note;

        private string lastText;
        private readonly NotesContext db;

        public string Text
        {
            get => note.Text;
            set
            {
                if (note.Text != value)
                {
                    note.Text = value;
                    OnPropertyChanged(nameof(Text));
                    OnPropertyChanged(nameof(IsChanged));
                }
            }
        }

        public DateTime Date => note.Date ?? DateTime.Now;
        public int Identifier => note.Id;
        public AsyncRelayCommand SaveCommand { get; }
        public ICommand DeleteCommand { get; }

        public NoteViewModel()
            : this(new())

        {
            PropertyChanged += NoteViewModel_PropertyChanged;
        }

        private void NoteViewModel_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(IsChanged))
            {
                SaveCommand.NotifyCanExecuteChanged();
            }
        }

        public NoteViewModel(Note note)
        {
            db = new NotesContext();
            this.note = note;
            lastText = note.Text;
            SaveCommand = new AsyncRelayCommand(SaveAsync, () => IsChanged);
            DeleteCommand = new AsyncRelayCommand(Delete);
        }

        public bool IsChanged => Text != lastText;

        private async Task SaveAsync()
        {
            note.Date = DateTime.Now;
            await db.SaveChangesAsync();
            lastText = Text;
            OnPropertyChanged(nameof(IsChanged));
            await Shell.Current.GoToAsync($"..?saved={note.Id}");
        }

        private async Task Delete()
        {
            db.Remove(note);
            await Shell.Current.GoToAsync($"..?deleted={note.Id}");
        }

        void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
        {
            if (query.ContainsKey("load")
                && int.TryParse(query["load"].ToString(), out var noteId))
            {
                note = db.Notes.SingleOrDefault(v => v.Id == noteId);
                RefreshProperties();
            }
        }

        public void Reload()
        {
            note = db.Notes.SingleOrDefault(v => v.Id == note.Id);
            RefreshProperties();
        }

        private void RefreshProperties()
        {
            OnPropertyChanged(nameof(Text));
            OnPropertyChanged(nameof(Date));
        }
    }
}
