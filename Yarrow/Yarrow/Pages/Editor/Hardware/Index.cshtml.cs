using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Text.RegularExpressions;

using Yarrow.Data;
using Yarrow.Models;

namespace Yarrow.Pages.Editor.Hardware
{

    public class IndexModel : EditorPageModel, IComparer<string>
    {
        public IEnumerable<HeadsetOutput> Headsets { get; private set; }

        public IndexModel(YarrowContext db, IWebHostEnvironment env, ILogger<IndexModel> logger)
            : base(db, "headset", env, logger)
        {
        }

        public IActionResult OnGet()
        {
            if (!CurrentUser.IsAdmin)
            {
                return Forbid();
            }

            Headsets = Database.Headsets
                .AsNoTracking()
                .Include(h => h.HeadsetLocations
                    .Where(hl => hl.EndDate == null))
                .Select(h => new HeadsetOutput(h))
                .AsEnumerable()
                .OrderBy(h => h.Name, this);

            return Page();
        }

        private static readonly Regex headsetNamePattern = new("(.+)-(\\d+)", RegexOptions.Compiled);

        public int Compare(string x, string y)
        {
            var matchX = headsetNamePattern.Match(x);
            var matchY = headsetNamePattern.Match(y);

            if (matchX.Success && matchY.Success)
            {
                var seriesX = matchX.Groups[1].Value;
                var numberX = int.Parse(matchX.Groups[2].Value);
                var seriesY = matchY.Groups[1].Value;
                var numberY = int.Parse(matchY.Groups[2].Value);

                var seriesCompare = seriesX.CompareTo(seriesY);
                if (seriesCompare != 0)
                {
                    return seriesCompare;
                }
                else if (numberX < numberY)
                {
                    return -1;
                }
                else if (numberX > numberY)
                {
                    return 1;
                }
                else
                {
                    // fall through to comparing the original strings.
                }
            }

            return x.CompareTo(y);
        }

        public IActionResult OnPost([FromForm] HeadsetCreateInput input)
        {
            var headset = new Headset
            {
                Name = input.HeadsetName,
                SerialNumber = input.HeadsetSN,
                Model = input.HeadsetModel,
                PurchaseDate = input.PurchaseDate?.ToDateOnly(),
                HeadsetLocations = new[]
                {
                    new HeadsetLocation
                    {
                        Description = input.HeadsetLocation
                    }
                }
            };

            if (input.PurchasePrice is not null)
            {
                headset.PurchasePrice = (int)(input.PurchasePrice * 100);
            }

            Database.Headsets.Add(headset);

            Database.SaveChanges();

            return OnGet();
        }
    }
}
