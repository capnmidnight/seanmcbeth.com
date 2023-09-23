using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    /// <inheritdoc />
    public partial class RemoveScenarioNameAndLanguage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Scenario_Language",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "fki_FK_Scenario_Language",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Scenarios");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Scenarios",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "fki_FK_Scenario_Language",
                table: "Scenarios",
                columns: new[] { "ID", "LanguageID" });

            migrationBuilder.AddForeignKey(
                name: "FK_Scenario_Language",
                table: "Scenarios",
                column: "LanguageID",
                principalTable: "Languages",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
