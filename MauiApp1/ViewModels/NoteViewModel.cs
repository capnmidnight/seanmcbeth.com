using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;

namespace MauiApp1.ViewModels
{
    internal class NoteViewModel: ObservableObject, IQueryAttributable
    {
        private Models.Note note;


        public string Text
        {
            get => note.Text;
            set
            {
                if(note.Text != value)
                {
                    note.Text = value;
                    OnPropertyChanged(nameof(Text));
                }
            }
        }

        public DateTime Date => note.Date;
        public string Identifier => note.Filename;
        public ICommand SaveCommand { get; }
        public ICommand DeleteCommand { get; }
        public ICommand CancelCommand { get; }

        public NoteViewModel()
            : this(new())
             
        {
        }

        public NoteViewModel(Models.Note note)
        {
            this.note = note;
            SaveCommand = new AsyncRelayCommand(SaveAsync);
            DeleteCommand = new AsyncRelayCommand(Delete);
            CancelCommand = new AsyncRelayCommand(CancelAsync);
        }

        private async Task SaveAsync()
        {
            note.Date = DateTime.Now;
            await note.SaveAsync();
            await Shell.Current.GoToAsync($"..?saved={note.Filename}");
        }

        private async Task Delete()
        {
            note.Delete();
            await Shell.Current.GoToAsync($"..?deleted={note.Filename}");
        }

        private async Task CancelAsync()
        {
            await Shell.Current.GoToAsync($"..?canceled={note.Filename}");
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
