using MauiApp1.ViewModels;

namespace MauiApp1.Views
{
    public partial class NotePage : ContentPage
    {
        public NotePage()
        {
            InitializeComponent();
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            if(BindingContext is NoteViewModel note)
            {
                note.PropertyChanged += Note_PropertyChanged;
            }
        }

        private void Note_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if(sender is NoteViewModel note)
            {
                SaveToolbarItem.IconImageSource = new FontImageSource()
                {
                    Glyph= "💾",
                    Size = 22,
                    Color = note.IsChanged 
                        ? Application.Current.PlatformAppTheme == AppTheme.Dark
                            ? Colors.White
                            : Colors.Black
                            : Colors.Silver
                };
            }
        }
    }
}