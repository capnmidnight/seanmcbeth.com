using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    /// <inheritdoc />
    public partial class UserHeadsetAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeadsetId",
                table: "UserProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_HeadsetId",
                table: "UserProfiles",
                column: "HeadsetId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserId_HeadsetId",
                table: "UserProfiles",
                columns: new[] { "UserId", "HeadsetId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_UserProfiles_HeadsetId",
                table: "UserProfiles",
                column: "HeadsetId",
                principalTable: "UserProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_UserProfiles_HeadsetId",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_UserProfiles_HeadsetId",
                table: "UserProfiles");

            migrationBuilder.DropIndex(
                name: "IX_UserProfiles_UserId_HeadsetId",
                table: "UserProfiles");

            migrationBuilder.DropColumn(
                name: "HeadsetId",
                table: "UserProfiles");
        }
    }
}
