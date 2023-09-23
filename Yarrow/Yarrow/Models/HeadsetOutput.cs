using System.Text.RegularExpressions;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class HeadsetOutput
    {
        public int HeadsetID { get; }
        public int? PurchasePrice { get; }
        public string Name { get; }
        public string SerialNumber { get; }
        public string Model { get; }
        public string Notes { get; }

        public string CurrentLocation { get; }
        public DateTime CurrentLocationStartDate { get; }
        public IEnumerable<HeadsetLocation> Locations { get; }
        public DateTime? PurchaseDate { get; }

        private static readonly Regex UPSTrackingNumberPattern = new(@"1Z(\w{6})(\w\w)(\w{7})(\w)", RegexOptions.Compiled);
        private static readonly Regex FedExTrackingNumberPattern = new(@"(\d{4}) ?(\d{4}) ?(\d{4})", RegexOptions.Compiled);

        public string TrackingNumber { get; }

        public bool IsUPSTrackingNumber { get; }
        public bool IsFedExTrackingNumber { get; }

        public bool HasTrackingNumber => IsUPSTrackingNumber || IsFedExTrackingNumber;

        public string TrackingLink
        {
            get
            {
                if (IsUPSTrackingNumber)
                {
                    return $"https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums={TrackingNumber}";
                }

                if (IsFedExTrackingNumber)
                {
                    return $"https://www.fedex.com/fedextrack/?trknbr={TrackingNumber}";
                }

                return null;
            }
        }

        public string PurchasePriceUSD
        {
            get
            {
                if (PurchasePrice is not null)
                {
                    var dollars = PurchasePrice / 100;
                    var cents = PurchasePrice - (dollars * 100);
                    return $"${dollars:n0}.{cents:00}";
                }

                return null;
            }
        }

        public HeadsetOutput(Headset h)
        {
            HeadsetID = h.Id;
            Name = h.Name;
            Model = h.Model;
            SerialNumber = h.SerialNumber;
            PurchasePrice = h.PurchasePrice;
            PurchaseDate = h.PurchaseDate?.ToDateTime(TimeOnly.MinValue);
            Notes = h.Notes;

            Locations = h.HeadsetLocations
                    .OrderByDescending(hl => hl.StartDate)
                    .ThenByDescending(hl => hl.EndDate ?? DateOnly.MaxValue);

            var hl = Locations.FirstOrDefault();
            CurrentLocation = hl?.Description ?? "None";
            var startDate = hl?.StartDate ?? DateOnly.MaxValue;
            CurrentLocationStartDate = startDate.ToDateTime(TimeOnly.MinValue);

            if (CurrentLocation is not null)
            {
                var match = UPSTrackingNumberPattern.Match(CurrentLocation);
                IsUPSTrackingNumber = match.Success;
                if (IsUPSTrackingNumber)
                {
                    TrackingNumber = match.Value;
                }
                else
                {
                    match = FedExTrackingNumberPattern.Match(CurrentLocation);
                    IsFedExTrackingNumber = match.Success;
                    if (IsFedExTrackingNumber)
                    {
                        TrackingNumber = match.Value;
                    }
                }
            }
        }
    }
}
