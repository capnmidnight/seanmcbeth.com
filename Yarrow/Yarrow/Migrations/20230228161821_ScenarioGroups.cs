using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Yarrow.Migrations
{
    /// <inheritdoc />
    public partial class ScenarioGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Published",
                table: "Scenarios",
                type: "boolean",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ScenarioGroupId",
                table: "Scenarios",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Scenarios",
                type: "integer",
                nullable: true,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationId",
                table: "MenuItems",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ScenarioGroupId",
                table: "MenuItems",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ScenarioGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    LanguageId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScenarioGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScenarioGroup_Language",
                        column: x => x.LanguageId,
                        principalTable: "Languages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ScenarioGroupsGrantedToOrganizations",
                columns: table => new
                {
                    ScenarioGroupId = table.Column<int>(type: "integer", nullable: false),
                    OrganizationId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("ScenarioGroupsGrantedToOrganizations_pk", x => new { x.ScenarioGroupId, x.OrganizationId });
                    table.ForeignKey(
                        name: "_ScenarioGroupsGrantedToOrganizations_FK_OrganizationId",
                        column: x => x.OrganizationId,
                        principalTable: "Organizations",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "_ScenarioGroupsGrantedToOrganizations_FK_ScenarioGroupId",
                        column: x => x.ScenarioGroupId,
                        principalTable: "ScenarioGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "fki_FK_Scenario_ScenarioGroup",
                table: "Scenarios",
                columns: new[] { "ID", "ScenarioGroupId" });

            migrationBuilder.CreateIndex(
                name: "IX_Scenarios_ScenarioGroupID",
                table: "Scenarios",
                column: "ScenarioGroupId");

            migrationBuilder.CreateIndex(
                name: "fki_FK_MenuItem_ScenarioGroup",
                table: "MenuItems",
                columns: new[] { "ID", "ScenarioGroupId" });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_OrganizationId",
                table: "MenuItems",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_ScenarioGroupID",
                table: "MenuItems",
                column: "ScenarioGroupId");

            migrationBuilder.CreateIndex(
                name: "fki_FK_ScenarioGroup_Language",
                table: "ScenarioGroups",
                columns: new[] { "Id", "LanguageId" });

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioGroups_LanguageID",
                table: "ScenarioGroups",
                column: "LanguageId");

            migrationBuilder.CreateIndex(
                name: "_ScenarioGroupsGrantedToOrganizations_ScenarioGroupId_OrganizationId_IDX",
                table: "ScenarioGroupsGrantedToOrganizations",
                columns: new[] { "ScenarioGroupId", "OrganizationId" });

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioGroupsGrantedToOrganizations_OrganizationId",
                table: "ScenarioGroupsGrantedToOrganizations",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_ScenarioGroupsGrantedToOrganizations_ScenarioGroupId",
                table: "ScenarioGroupsGrantedToOrganizations",
                column: "ScenarioGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_Organization",
                table: "MenuItems",
                column: "OrganizationId",
                principalTable: "Organizations",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_ScenarioGroup",
                table: "MenuItems",
                column: "ScenarioGroupId",
                principalTable: "ScenarioGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenario_ScenarioGroup",
                table: "Scenarios",
                column: "ScenarioGroupId",
                principalTable: "ScenarioGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_Organization",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_ScenarioGroup",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenario_ScenarioGroup",
                table: "Scenarios");

            migrationBuilder.DropTable(
                name: "ScenarioGroupsGrantedToOrganizations");

            migrationBuilder.DropTable(
                name: "ScenarioGroups");

            migrationBuilder.DropIndex(
                name: "fki_FK_Scenario_ScenarioGroup",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "IX_Scenarios_ScenarioGroupID",
                table: "Scenarios");

            migrationBuilder.DropIndex(
                name: "fki_FK_MenuItem_ScenarioGroup",
                table: "MenuItems");

            migrationBuilder.DropIndex(
                name: "IX_MenuItems_OrganizationId",
                table: "MenuItems");

            migrationBuilder.DropIndex(
                name: "IX_MenuItems_ScenarioGroupID",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Published",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "ScenarioGroupId",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "ScenarioGroupId",
                table: "MenuItems");
        }
    }
}
