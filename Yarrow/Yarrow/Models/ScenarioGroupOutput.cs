using System.Runtime.Serialization;
using System.Text.Json.Serialization;

using Yarrow.Data;

namespace Yarrow.Models
{
    public class ScenarioGroupOutput
    {
        public int ID { get; }
        public string Name { get; }
        public int LanguageID { get; }
        public string LanguageName { get; }
        public ScenarioOutput[] Scenarios { get; }
        public ScenarioOutput LatestVersion { get; }
        public DateTime CreatedOn { get; }
        public string CreatedBy { get; }

        [JsonConstructor]
        public ScenarioGroupOutput(
            int id,
            string name,
            int languageID,
            string languageName,
            DateTime createdOn,
            string createdBy,
            ScenarioOutput[] scenarios)
        {
            ID = id;
            Name = name;
            LanguageID = languageID;
            LanguageName = languageName;
            CreatedOn = createdOn;
            CreatedBy = createdBy;
            Scenarios = scenarios
                    .OrderByDescending(v => v.Version)
                    .ToArray();
            LatestVersion = Scenarios
                    .FirstOrDefault();
        }

        public ScenarioGroupOutput(ScenarioGroup sg)
            : this(
                  sg.Id,
                  sg.Name,
                  sg.LanguageId,
                  sg.Language.Name,
                  sg.Timestamp,
                  sg.CreatedBy?.FullName,
                  sg.Scenarios
                    .Select(s => new ScenarioOutput(s))
                    .ToArray())
        {
        }


        public ScenarioGroupOutput(SerializationInfo info, StreamingContext context)
            : this(
                  info.GetInt32(nameof(ID)),
                  info.GetString(nameof(Name)),
                  info.GetInt32(nameof(LanguageID)),
                  info.GetString(nameof(LanguageName)),
                  info.GetDateTime(nameof(CreatedOn)),
                  info.GetString(nameof(CreatedBy)),
                  info.GetValue<ScenarioOutput[]>(nameof(Scenarios)))
        {
        }
    }
}
