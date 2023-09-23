using System.Text.Json;

namespace Yarrow.Data
{
    public partial class Log
    {
        private static string GetValueString(JsonProperty r) =>
            r.Value.GetString();
        private static int? GetValueInt32(JsonProperty r) =>
            r.Value.GetInt32();
        private static double? GetValueDouble(JsonProperty r) =>
            r.Value.GetDouble();

        public (string userName, string meetingID, string userType) GetTeleconfParams()
        {
            if (Value is null)
            {
                return default;
            }

            using var doc = JsonDocument.Parse(Value);
            var fields = doc
                .RootElement
                .EnumerateObject()
                .Where(r => r.Name is not null)
                .ToDictionary(r => r.Name);

            var userName = fields.PopKey("userName", GetValueString);
            var meetingID = fields.PopKey("meetingID", GetValueString);
            var userType = fields.PopKey("userType", GetValueString);
            return (userName, meetingID, userType);
        }

        public int? GetID()
        {
            if (Value is null)
            {
                return default;
            }

            using var doc = JsonDocument.Parse(Value);
            var fields = doc.RootElement.EnumerateObject().ToDictionary(r => r.Name);

            return fields.PopKey("id", GetValueInt32);
        }

        public (int? id, int? page) GetIDAndPage()
        {
            if (Value is null)
            {
                return default;
            }

            using var doc = JsonDocument.Parse(Value);
            var fields = doc.RootElement.EnumerateObject().ToDictionary(r => r.Name);
            var id = fields.PopKey("id", GetValueInt32);
            var page = fields.PopKey("page", GetValueInt32);
            return (id, page);
        }

        public (int? id, double? duration) GetIDAndDuration()
        {
            if (Value is null)
            {
                return default;
            }

            using var doc = JsonDocument.Parse(Value);
            var fields = doc.RootElement.EnumerateObject().ToDictionary(r => r.Name);
            var id = fields.PopKey("id", GetValueInt32);
            var duration = fields.PopKey("time", GetValueDouble);
            return (id, duration);
        }

        public bool TryGetTeleconfParams(out string userName, out string meetingID, out string userType)
        {
            (userName, meetingID, userType) = GetTeleconfParams();
            return userName is not null
                && meetingID is not null;
            // don't check userType, because it's not always available.
        }

        public bool TryGetID(out int id)
        {
            var _id = GetID();
            id = _id ?? 0;
            return _id.HasValue;
        }

        public bool TryGetIDAndPage(out int id, out int page)
        {
            var (_id, _page) = GetIDAndPage();
            id = _id ?? 0;
            page = _page ?? 0;
            return _id.HasValue && _page.HasValue;
        }

        public bool TryGetIDAndDuration(out int id, out double duration)
        {
            var (_id, _duration) = GetIDAndDuration();
            id = _id ?? 0;
            duration = _duration ?? 0;
            return _id.HasValue && _duration.HasValue;
        }
    }
}
