using Silk.NET.Input;
using Silk.NET.Windowing;
using Silk.NET.Maths;

using var window = Window.Create(WindowOptions.Default with
{
    Size = new Vector2D<int>(800, 600),
    Title = "My first Silk.NET application!",
    WindowBorder = WindowBorder.Hidden
});

window.Load += () =>
{
    using var input = window.CreateInput();
    if (input.Keyboards.Count == 0)
    {
        Console.Error.WriteLine("No keyboards");
        window.Close();
        return;
    }

    var keyboard = input.Keyboards[0];
    window.Update += dt =>
    {
        if (keyboard.IsKeyPressed(Key.Left))
        {
            Console.WriteLine("<-");
        }
    };
};

window.Run();