using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    public partial class RemoveExtraneousAudioColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoPlay",
                table: "AudioTracks");

            migrationBuilder.DropColumn(
                name: "Loop",
                table: "AudioTracks");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AutoPlay",
                table: "AudioTracks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Loop",
                table: "AudioTracks",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
