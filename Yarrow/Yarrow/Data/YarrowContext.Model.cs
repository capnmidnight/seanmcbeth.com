using Microsoft.EntityFrameworkCore;

namespace Yarrow.Data
{
    public partial class YarrowContext
    {
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasSequence("Activities_ID_seq").HasMax(2147483647);
            modelBuilder.HasAnnotation("Relational:Collation", "C.UTF-8");
        }
    }
}
