using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    /// <inheritdoc />
    public partial class PublishData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "fki_FK_Scenario_StartStation",
                table: "Scenarios",
                newName: "IX_Scenario_StartStationID");

            migrationBuilder.AddColumn<string>(
                name: "CreatedById",
                table: "Scenarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublishedById",
                table: "Scenarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedOn",
                table: "Scenarios",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedById",
                table: "ScenarioGroups",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "fki_FK_Scenario_CreatedBy",
                table: "Scenarios",
                columns: new[] { "ID", "CreatedById" });

            migrationBuilder.CreateIndex(
                name: "fki_FK_Scenario_PublishedBy",
                table: "Scenarios",
                columns: new[] { "ID", "PublishedById" });

            migrationBuilder.CreateIndex(
                name: "fki_FK_Scenario_StartStation",
                table: "Scenarios",
                columns: new[] { "ID", "StartStationID" });

            migrationBuilder.CreateIndex(
                name: "IX_Scenarios_CreatedByID",
                table: "Scenarios",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Scenarios_PublishedByID",
                table: "Scenarios",
                column: "PublishedById");

            migrationBuilder.CreateIndex(
                name: "fki_FK_ScenarioGroup_CreatedBy",
                table: "ScenarioGroups",
                columns: new[] { "Id", "CreatedById" });

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioGroups_CreatedByID",
                table: "ScenarioGroups",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_ScenarioGroup_CreatedBy",
                table: "ScenarioGroups",
                column: "CreatedById",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenarios_CreatedBy",
                table: "Scenarios",
                column: "CreatedById",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenarios_PublishedBy",
                table: "Scenarios",
                column: "PublishedById",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ScenarioGroup_CreatedBy",
                table: "ScenarioGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenarios_CreatedBy",
                table: "Scenarios");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenarios_PublishedBy",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "fki_FK_Scenario_CreatedBy",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "fki_FK_Scenario_PublishedBy",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "fki_FK_Scenario_StartStation",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "IX_Scenarios_CreatedByID",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "IX_Scenarios_PublishedByID",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "fki_FK_ScenarioGroup_CreatedBy",
                table: "ScenarioGroups");

            migrationBuilder.DropIndex(
                name: "IX_ScenarioGroups_CreatedByID",
                table: "ScenarioGroups");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "PublishedById",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "PublishedOn",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "ScenarioGroups");

            migrationBuilder.RenameIndex(
                name: "IX_Scenario_StartStationID",
                table: "Scenarios",
                newName: "fki_FK_Scenario_StartStation");
        }
    }
}
