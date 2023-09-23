using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        public IQueryable<Language> GetLanguages(bool showMeta) =>
            Languages
                .Where(l => showMeta || l.Name != "Meta")
                .OrderBy(x => x.Name);

        public Task<Language> GetLanguageAsync(int languageID) =>
            Languages.SingleOrDefaultAsync(lang => lang.Id == languageID);
    }
}
