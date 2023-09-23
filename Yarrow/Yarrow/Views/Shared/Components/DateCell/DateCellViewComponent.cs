using Microsoft.AspNetCore.Mvc;

namespace Yarrow.Views.Shared.Components.DateCell
{
    public class DateCellViewComponent : ViewComponent
    {
        public record Model(DateTime? Value);

        public IViewComponentResult Invoke(DateTime? value) =>
            View(new Model(value));
    }
}
