using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    /// <inheritdoc />
    public partial class RemoveNullables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_Scenario",
                table: "MenuItems");

            migrationBuilder.DropIndex(
                name: "fki_FK_MenuItem_Scenario",
                table: "MenuItems");

            migrationBuilder.RenameColumn(
                name: "ScenarioID",
                table: "MenuItems",
                newName: "ScenarioId");

            migrationBuilder.AlterColumn<int>(
                name: "TransformID",
                table: "StationConnections",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Version",
                table: "Scenarios",
                type: "integer",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true,
                oldDefaultValue: 1);

            migrationBuilder.AlterColumn<int>(
                name: "ScenarioGroupId",
                table: "Scenarios",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Published",
                table: "Scenarios",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true,
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "OrganizationId",
                table: "MenuItems",
                type: "integer",
                nullable: false,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_Scenarios_ScenarioId",
                table: "MenuItems",
                column: "ScenarioId",
                principalTable: "Scenarios",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_Scenarios_ScenarioId",
                table: "MenuItems");

            migrationBuilder.RenameColumn(
                name: "ScenarioId",
                table: "MenuItems",
                newName: "ScenarioID");

            migrationBuilder.AlterColumn<int>(
                name: "TransformID",
                table: "StationConnections",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "Version",
                table: "Scenarios",
                type: "integer",
                nullable: true,
                defaultValue: 1,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 1);

            migrationBuilder.AlterColumn<int>(
                name: "ScenarioGroupId",
                table: "Scenarios",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<bool>(
                name: "Published",
                table: "Scenarios",
                type: "boolean",
                nullable: true,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "OrganizationId",
                table: "MenuItems",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "fki_FK_MenuItem_Scenario",
                table: "MenuItems",
                columns: new[] { "ID", "ScenarioID" });

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_Scenario",
                table: "MenuItems",
                column: "ScenarioID",
                principalTable: "Scenarios",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
