using Microsoft.AspNetCore.Mvc;

namespace Yarrow.Views.Shared.Components.DateRange
{
    public class DateRangeViewComponent : ViewComponent
    {
        public record Model(string IDStub);

        public IViewComponentResult Invoke(string idStub) =>
            View(new Model(idStub));
    }
}
