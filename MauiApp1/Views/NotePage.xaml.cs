using MauiApp1.ViewModels;

namespace MauiApp1.Views
{
    public partial class NotePage : ContentPage
    {
        private NoteViewModel lastNote;

        private readonly ImageSource disabled, enabledDark, enabledLight;

        public NotePage()
        {
            InitializeComponent();

            disabled = new FontImageSource()
            {
                Glyph = "💾",
                Size = 22,
                Color = Colors.Silver
            };

            enabledDark = new FontImageSource()
            {
                Glyph = "💾",
                Size = 22,
                Color = Colors.White
            };

            enabledLight = new FontImageSource()
            {
                Glyph = "💾",
                Size = 22,
                Color = Colors.Black
            };
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();
            
            if (BindingContext is NoteViewModel note 
                && note != lastNote)
            {
                if (lastNote is not null)
                {
                    lastNote.PropertyChanged -= Note_PropertyChanged;
                }

                if (note is not null)
                {
                    note.PropertyChanged += Note_PropertyChanged;
                }

                lastNote = note;
            }
        }

        private void Note_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (sender is NoteViewModel note)
            {
                SaveToolbarItem.IconImageSource = note.IsChanged
                    ? Application.Current.PlatformAppTheme == AppTheme.Dark
                        ? enabledDark
                        : enabledLight
                        : disabled;
            }
        }
    }
}