namespace MauiApp1.Views
{
    [QueryProperty(nameof(ItemId), nameof(ItemId))]
    public partial class NotePage : ContentPage
    {
        internal static string MakeURL(Models.Note note)
        {
            return $"{nameof(NotePage)}?{nameof(ItemId)}={note.Filename}";
        }

        public string ItemId { set { LoadNote(value); } }

        private void LoadNote(string fileName)
        {
            BindingContext = new Models.Note(fileName);
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
                note.Save(TextEditor.Text);
            }

            await Shell.Current.GoToAsync("..");
        }

        private async void DeleteButton_Clicked(object sender, EventArgs e)
        {
            if (BindingContext is Models.Note note)
            {
                note.Delete();
            }

            await Shell.Current.GoToAsync("..");
        }

        private async void CancelButton_Clicked(object sender, EventArgs e)
        {
            await Shell.Current.GoToAsync("..");
        }
    }
}