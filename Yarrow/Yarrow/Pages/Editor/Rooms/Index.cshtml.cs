using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Rooms
{
    public class IndexModel : EditorPageModel
    {
        public Room[] Rooms { get; private set; }

        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "room", env, logger)
        {
        }

        public async Task<IActionResult> OnGetAsync()
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            Rooms = await Database
                .Rooms
                .Include(r => r.Users)
                .OrderBy(r => r.Name)
                .ToArrayAsync();

            return Page();
        }

        public Task<IActionResult> OnPostCreate([FromForm] NameInput input) =>
            WithStatusReportAsync("create",
                OnGetAsync,
                async () =>
                {
                    if (string.IsNullOrEmpty(input?.Name))
                    {
                        throw new FileNotFoundException("No valid room name provided.");
                    }

                    if (Database.Rooms.Any(room => room.Name == input.Name))
                    {
                        throw new Exception($"{input.Name} already exists.");
                    }

                    var room = new Room
                    {
                        Name = input.Name
                    };

                    await Database.Rooms.AddAsync(room);
                    await Database.SaveChangesAsync();

                    return $"redirect:~/Editor/Rooms/Detail/{room.Id}";
                });
    }
}
