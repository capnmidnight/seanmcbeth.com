namespace MauiApp1.Views;

public partial class AllNotesPage : ContentPage
{
	public AllNotesPage()
	{
		InitializeComponent();

		BindingContext = new Models.AllNotes();
	}

    protected override void OnAppearing()
    {
        if(BindingContext is Models.AllNotes allNotes)
        {
            allNotes.LoadNotes();
        }
    }

    private async void Add_Clicked(object sender, EventArgs e)
    {
        await Shell.Current.GoToAsync(nameof(NotePage));
    }

    private async void notesCollection_SelectionChanged(object sender, SelectionChangedEventArgs e)
    {
        if(e.CurrentSelection.Count > 0)
        {
            var obj = e.CurrentSelection[0];
            if(obj is Models.Note note)
            {
                await Shell.Current.GoToAsync($"{nameof(NotePage)}?{nameof(NotePage.ItemId)}={note.Filename}");
            }
            notesCollection.SelectedItem = null;
        }
    }
}