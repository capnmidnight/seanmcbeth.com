using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    public partial class Sign_Always_Visible_Option : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AlwaysVisible",
                table: "Signs",
                type: "boolean",
                nullable: true);

            migrationBuilder.UpdateData(
                "Signs",
                "AlwaysVisible",
                null,
                "AlwaysVisible", false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlwaysVisible",
                table: "Signs");
        }
    }
}
