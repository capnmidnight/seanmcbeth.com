using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

using System.ComponentModel;
using System.Windows.Input;

namespace MauiApp1.ViewModels
{
    internal class NoteViewModel: ObservableObject, IQueryAttributable
    {
        private Models.Note note;

        private string lastText;

        public string Text
        {
            get => note.Text;
            set
            {
                if(note.Text != value)
                {
                    note.Text = value;
                    OnPropertyChanged(nameof(Text));
                    OnPropertyChanged(nameof(IsChanged));
                }
            }
        }

        public DateTime Date => note.Date;
        public string Identifier => note.Filename;
        public AsyncRelayCommand SaveCommand { get; }
        public ICommand DeleteCommand { get; }

        public NoteViewModel()
            : this(new())
             
        {
            PropertyChanged += NoteViewModel_PropertyChanged;
        }

        private void NoteViewModel_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if(e.PropertyName == nameof(IsChanged))
            {
                SaveCommand.NotifyCanExecuteChanged();
            }
        }

        public NoteViewModel(Models.Note note)
        {
            this.note = note;
            lastText = note.Text;
            SaveCommand = new AsyncRelayCommand(SaveAsync, () => IsChanged);
            DeleteCommand = new AsyncRelayCommand(Delete);
        }

        public bool IsChanged => Text != lastText;

        private async Task SaveAsync()
        {
            note.Date = DateTime.Now;
            await note.SaveAsync();
            lastText = Text;
            OnPropertyChanged(nameof(IsChanged));
            await Shell.Current.GoToAsync($"..?saved={note.Filename}");
        }

        private async Task Delete()
        {
            note.Delete();
            await Shell.Current.GoToAsync($"..?deleted={note.Filename}");
        }

        void IQueryAttributable.ApplyQueryAttributes(IDictionary<string, object> query)
        {
            if (query.ContainsKey("load"))
            {
                note = Models.Note.Load(query["load"].ToString());
                RefreshProperties();
            }
        }
        public void Reload()
        {
            note = Models.Note.Load(note.Filename);
            RefreshProperties();
        }

        private void RefreshProperties()
        {
            OnPropertyChanged(nameof(Text));
            OnPropertyChanged(nameof(Date));
        }
    }
}
