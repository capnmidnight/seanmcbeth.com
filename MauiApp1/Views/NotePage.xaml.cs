namespace MauiApp1.Views
{
    [QueryProperty(nameof(ItemId), nameof(ItemId))]
    public partial class NotePage : ContentPage
    {
        public string ItemId { set { LoadNote(value); } }

        private void LoadNote(string fileName)
        {
            var noteModel = new Models.Note()
            {
                Filename = fileName
            };

            if (File.Exists(noteModel.Filename))
            {
                noteModel.Date = File.GetCreationTime(noteModel.Filename);
                noteModel.Text = File.ReadAllText(noteModel.Filename);
            }

            BindingContext = noteModel;
        }

        public NotePage()
        {
            InitializeComponent();

            string appDataPath = FileSystem.AppDataDirectory;
            string randomFileName = $"{Path.GetRandomFileName()}.notes.txt";

            LoadNote(Path.Combine(appDataPath, randomFileName));
        }

        private async void SaveButton_Clicked(object sender, EventArgs e)
        {
            if (BindingContext is Models.Note note)
            {
                File.WriteAllText(note.Filename, TextEditor.Text);
            }

            await Shell.Current.GoToAsync("..");
        }

        private async void DeleteButton_Clicked(object sender, EventArgs e)
        {
            if (BindingContext is Models.Note note
                && File.Exists(note.Filename))
            {
                File.Delete(note.Filename);
            }

            await Shell.Current.GoToAsync("..");
        }

        private async void CancelButton_Clicked(object sender, EventArgs e)
        {
            await Shell.Current.GoToAsync("..");
        }
    }
}