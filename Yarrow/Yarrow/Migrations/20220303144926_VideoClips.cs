using Microsoft.EntityFrameworkCore.Migrations;

using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Yarrow.Migrations
{
    public partial class VideoClips : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AltMIME",
                table: "Files",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VideoClips",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TransformID = table.Column<int>(type: "integer", nullable: false),
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    Volume = table.Column<float>(type: "real", nullable: false),
                    Enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValueSql: "true"),
                    Label = table.Column<string>(type: "text", nullable: false, defaultValueSql: "''::text"),
                    SphereEncoding = table.Column<string>(type: "text", nullable: false),
                    StereoLayout = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideoClips", x => x.ID);
                    table.ForeignKey(
                        name: "FK_VideoClips_Files",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VideoClips_Transforms",
                        column: x => x.TransformID,
                        principalTable: "Transforms",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "VideoClips_FileID_index",
                table: "VideoClips",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "VideoClips_TransformID_index",
                table: "VideoClips",
                column: "TransformID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VideoClips");

            migrationBuilder.DropColumn(
                name: "AltMIME",
                table: "Files");
        }
    }
}
