using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    public partial class Drop_Files_DiskPathName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiskPathName",
                table: "Files");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiskPathName",
                table: "Files",
                type: "text",
                nullable: true);
        }
    }
}
