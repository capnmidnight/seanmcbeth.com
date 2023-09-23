using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Rooms
{
    public class DetailModel : EditorPageModel
    {
        public Room Room { get; private set; }
        public IEnumerable<UserOutput> Users { get; private set; }
        public IEnumerable<Organization> Organizations { get;private set; }

        public bool CanDelete { get; private set; }

        public DetailModel(YarrowContext db, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "room", env, logger)
        {
        }

        public async Task<IActionResult> OnGetAsync([FromRoute] int id)
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            Room ??= await Database
                .Rooms
                .Include(r => r.Users)
                .SingleOrDefaultAsync(r => r.Id == id);

            if (Room is null)
            {
                return NotFound();
            }

            Users = Database.GetFullUsers();

            Organizations = Database.Organizations.Where(o => o.Name != "Anonymouse");

            CanDelete = !Users.Any(u => u.RoomID == id);

            return Page();
        }

        public Task<IActionResult> OnPostSetUserAsync([FromRoute] int id, [FromForm] UserIDInput input) =>
            WithStatusReportAsync("set user in", () => OnGetAsync(id), async () =>
            {
                if (string.IsNullOrEmpty(input?.UserID))
                {
                    throw new Exception("System error");
                }

                Room = await Database
                    .Rooms
                    .SingleOrDefaultAsync(r => r.Id == id)
                    ?? throw new FileNotFoundException();

                var user = await Database
                    .UserProfiles
                    .Include(u => u.Room)
                    .Include(u => u.User)
                    .SingleOrDefaultAsync(user => user.UserId == input.UserID)
                    ?? throw new FileNotFoundException(input.UserID);

                if (user.Room is null)
                {
                    user.Room = Room;
                    await Database.SaveChangesAsync();
                    return $"User {user.User.Email} added to '{Room.Name}'";
                }
                else if (user.Room == Room)
                {
                    user.Room = null;
                    await Database.SaveChangesAsync();
                    return $"User {user.User.Email} removed from '{Room.Name}'";
                }
                else
                {
                    var oldRoom = user.Room;
                    user.Room = Room;
                    await Database.SaveChangesAsync();
                    return $"User {user.User.Email} removed from '{oldRoom.Name}' and added to {Room.Name}";
                }
            });

        public Task<IActionResult> OnPostDeleteAsync([FromRoute] int id)
        {
            return WithStatusReportAsync("delete",
                () => OnGetAsync(id),
                async () =>
                {
                    var room = await Database
                        .Rooms
                        .Include(r => r.Users)
                        .SingleOrDefaultAsync(r => r.Id == id) ?? throw new FileNotFoundException("Room not found");

                    if (room.Users.Count > 0)
                    {
                        throw new Exception("Room still has users assigned");
                    }

                    Database.Rooms.Remove(room);
                    await Database.SaveChangesAsync();

                    return $"redirect:~/Editor/Rooms";
                });
        }
    }
}
