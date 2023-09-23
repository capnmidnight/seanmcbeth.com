using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    public partial class ScenarioOrigin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "OriginAltitude",
                table: "Scenarios",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "OriginLatitude",
                table: "Scenarios",
                type: "real",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "OriginLongitude",
                table: "Scenarios",
                type: "real",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginAltitude",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "OriginLatitude",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "OriginLongitude",
                table: "Scenarios");
        }
    }
}
