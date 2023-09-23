using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Hardware
{

    public class DetailModel : EditorPageModel
    {
        public HeadsetOutput Headset { get; private set; }

        public DetailModel(YarrowContext db, IWebHostEnvironment env, ILogger<DetailModel> logger)
            : base(db, "headset", env, logger)
        {
        }

        public IActionResult OnGet(int headsetID)
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            Headset ??= new HeadsetOutput(QueryHeadset(headsetID));
            if (Headset is null)
            {
                return NotFound();
            }

            return Page();
        }

        private Headset QueryHeadset(int headsetID) =>
            Database.Headsets
                .Include(h => h.HeadsetLocations)
                .FirstOrDefault(h => h.Id == headsetID);

        public Task<IActionResult> OnPostUpdate(int headsetID, HeadsetUpdateInput input) =>
            WithStatusReportAsync("update",
                () => OnGet(headsetID),
                async () =>
                {
                    var headset = QueryHeadset(headsetID);
                    if (headset is null)
                    {
                        throw new FileNotFoundException();
                    }

                    var messages = new List<string>();
                    if (headset.Name != input.HeadsetName)
                    {
                        messages.Add($"Changed name from {headset.Name} to {input.HeadsetName}.");
                        headset.Name = input.HeadsetName;
                    }

                    var sn = input.HeadsetSN ?? "";
                    if (headset.SerialNumber != sn)
                    {
                        messages.Add($"Changed serial number from {headset.SerialNumber} to {sn}.");
                        headset.SerialNumber = sn;
                    }

                    if (headset.Model != input.HeadsetModel)
                    {
                        messages.Add($"Changed headset model from {headset.Model} to {input.HeadsetModel}.");
                        headset.Model = input.HeadsetModel;
                    }

                    var pd = input.PurchaseDate?.ToDateOnly();
                    if (headset.PurchaseDate != pd)
                    {
                        messages.Add($"Changed purchase date from {headset.PurchaseDate} to {pd}");
                        headset.PurchaseDate = pd;
                    }

                    var pp = input.PurchasePrice is not null
                        ? (int?)(input.PurchasePrice * 100)
                        : null;

                    if (headset.PurchasePrice != pp)
                    {
                        messages.Add($"Changed purchase price from {(headset.PurchasePrice / 100)?.ToString("C")} to {(pp / 100)?.ToString("C")}.");
                        headset.PurchasePrice = pp;
                    }

                    if (headset.Notes != input.Notes)
                    {
                        messages.Add($"Updated notes.");
                        headset.Notes = input.Notes;
                    }

                    var curLocation = headset.HeadsetLocations.Where(hl => hl.EndDate == null).FirstOrDefault();
                    if (curLocation?.Description != input.HeadsetLocation)
                    {
                        messages.Add($"Changed headset location from {curLocation?.Description ?? "N/A"} to {input.HeadsetLocation}.");

                        var date = DateOnly.FromDateTime(DateTime.Now);
                        foreach (var loc in headset.HeadsetLocations)
                        {
                            loc.EndDate ??= date;
                        }

                        var hl = new HeadsetLocation
                        {
                            Headset = headset,
                            Description = input.HeadsetLocation,
                            StartDate = date
                        };
                        headset.HeadsetLocations.Add(hl);
                        await Database.HeadsetLocations.AddAsync(hl);
                    }

                    if (messages.Count > 0)
                    {
                        await Database.SaveChangesAsync();
                    }
                    else
                    {
                        messages.Add("No change.");
                    }

                    Headset = new HeadsetOutput(headset);

                    return string.Join("\n", messages);
                });

        public Task<IActionResult> OnPostDelete(int headsetID) =>
            WithStatusReportAsync("delete",
                () => OnGet(headsetID),
                async () =>
                {
                    var headset = Database.Headsets
                        .Include(h => h.HeadsetLocations)
                        .FirstOrDefault(h => h.Id == headsetID);
                    if (headset is null)
                    {
                        throw new FileNotFoundException();
                    }

                    Database.HeadsetLocations.RemoveRange(headset.HeadsetLocations);
                    Database.Headsets.Remove(headset);
                    await Database.SaveChangesAsync();

                    return "redirect:~/Editor/Hardware";
                });
    }
}
