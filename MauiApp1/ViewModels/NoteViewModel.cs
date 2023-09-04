using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

using MauiApp1.Models;

using System.ComponentModel;
using System.Windows.Input;

namespace MauiApp1.ViewModels
{
    internal class NoteViewModel : ObservableObject, IQueryAttributable
    {
        public Note Note
        {
            get;
            private set;
        }

        private string lastText;
        private readonly NotesContext db;

        public string Text
        {
            get => Note.Text;
            set
            {
                if (Note.Text != value)
                {
                    Note.Text = value;
                    OnPropertyChanged(nameof(Text));
                    OnPropertyChanged(nameof(IsChanged));
                }
            }
        }

        public DateTime Date => Note.Date ?? DateTime.Now;
        public int Identifier => Note.Id;
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
            Note = note;
            lastText = note.Text;
            SaveCommand = new AsyncRelayCommand(SaveAsync, () => IsChanged);
            DeleteCommand = new AsyncRelayCommand(Delete);
        }

        public bool IsChanged => Text != lastText;

        private async Task SaveAsync()
        {
            Note.Date = DateTime.Now;
            lastText = Text;
            
            if(Note.Id == 0)
            {
                await db.Notes.AddAsync(Note);
            }
            await db.SaveChangesAsync();

            OnPropertyChanged(nameof(IsChanged));
            await Shell.Current.GoToAsync($"..?saved={Note.Id}");
        }

        private async Task Delete()
        {
            if(Note.Id > 0)
            {
                db.Notes.Remove(Note);
                await db.SaveChangesAsync();
            }

            await Shell.Current.GoToAsync($"..?deleted={Note.Id}");
        }

        void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
        {
            if (query.ContainsKey("load")
                && int.TryParse(query["load"].ToString(), out var noteId))
            {
                Load(noteId);
            }
        }

        public void Reload()
        {
            Load(Note.Id);
        }

        private void Load(int noteId)
        {
            Note = db.Notes.SingleOrDefault(v => v.Id == noteId);
            RefreshProperties();
        }

        private void RefreshProperties()
        {
            OnPropertyChanged(nameof(Text));
            OnPropertyChanged(nameof(Date));
        }
    }
}
