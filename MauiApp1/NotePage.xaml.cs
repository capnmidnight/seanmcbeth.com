namespace MauiApp1;

public partial class NotePage : ContentPage
{
	string fileName = Path.Combine(FileSystem.AppDataDirectory, "notes.txt");

	public NotePage()
	{
		InitializeComponent();

		if (File.Exists(fileName))
		{
			TextEditor.Text = File.ReadAllText(fileName);
		}
	}

	private void SaveButton_Clicked(object sender, EventArgs e)
	{
		File.WriteAllText(fileName, TextEditor.Text);
	}

	private void DeleteButton_Clicked(Object sender, EventArgs e)
	{
		if(File.Exists(fileName))
		{
			File.Delete(fileName);
		}

		TextEditor.Text = "";
	}
}