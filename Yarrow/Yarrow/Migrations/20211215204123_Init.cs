using Microsoft.EntityFrameworkCore.Migrations;

using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Yarrow.Migrations
{
    public partial class Init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "Activities_ID_seq",
                maxValue: 2147483647L);

            migrationBuilder.CreateSequence(
                name: "Errors_ID_seq",
                maxValue: 2147483647L);

            migrationBuilder.CreateTable(
                name: "Files",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    MIME = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    Size = table.Column<int>(type: "integer", nullable: false),
                    Copyright = table.Column<string>(type: "text", nullable: true, defaultValueSql: "''::text"),
                    CopyrightDate = table.Column<DateTime>(type: "date", nullable: true),
                    DiskPathName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Files", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "FileTags",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileTags", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Headsets",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SerialNumber = table.Column<string>(type: "text", nullable: false, defaultValueSql: "''::text"),
                    Model = table.Column<string>(type: "text", nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "date", nullable: true),
                    PurchasePrice = table.Column<int>(type: "integer", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true, defaultValueSql: "''::text")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Headsets", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Settings",
                columns: table => new
                {
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("Settings_pkey", x => x.Name);
                });

            migrationBuilder.CreateTable(
                name: "WebRTC",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Protocol = table.Column<string>(type: "text", nullable: false),
                    Host = table.Column<string>(type: "text", nullable: false),
                    Port = table.Column<int>(type: "integer", nullable: false),
                    Enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValueSql: "true")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebRTC", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FileContents",
                columns: table => new
                {
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    Data = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("FileContents_pkey", x => x.FileID);
                    table.ForeignKey(
                        name: "FK_FileContents_Files",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GSVMetadata",
                columns: table => new
                {
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    Pano = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<float>(type: "real", nullable: false),
                    Longitude = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("GSVMetadata_pkey", x => x.FileID);
                    table.ForeignKey(
                        name: "fk_Metadata_Files",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TagOnFile",
                columns: table => new
                {
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    TagID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("TagOnFile__pk", x => new { x.FileID, x.TagID });
                    table.ForeignKey(
                        name: "_TagOnFile__FK",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "_TagOnFile__FK_1",
                        column: x => x.TagID,
                        principalTable: "FileTags",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HeadsetLocations",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    HeadsetID = table.Column<int>(type: "integer", nullable: false),
                    StartDate = table.Column<DateTime>(type: "date", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    EndDate = table.Column<DateTime>(type: "date", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeadsetLocations", x => x.ID);
                    table.ForeignKey(
                        name: "FK_HeadsetLocations_to_Headsets",
                        column: x => x.HeadsetID,
                        principalTable: "Headsets",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AudioTracks",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TransformID = table.Column<int>(type: "integer", nullable: false),
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    Volume = table.Column<float>(type: "real", nullable: false),
                    MinDistance = table.Column<float>(type: "real", nullable: false),
                    MaxDistance = table.Column<float>(type: "real", nullable: false),
                    AutoPlay = table.Column<bool>(type: "boolean", nullable: false),
                    Loop = table.Column<bool>(type: "boolean", nullable: false),
                    Spatialize = table.Column<bool>(type: "boolean", nullable: false),
                    Zone = table.Column<string>(type: "text", nullable: false, defaultValueSql: "''::text"),
                    Enabled = table.Column<bool>(type: "boolean", nullable: false, defaultValueSql: "true"),
                    Label = table.Column<string>(type: "text", nullable: false, defaultValueSql: "''::text"),
                    Effect = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioTracks", x => x.ID);
                    table.ForeignKey(
                        name: "FK_AudioTracks_Files",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ParentID = table.Column<int>(type: "integer", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Label = table.Column<string>(type: "character varying", nullable: false),
                    Enabled = table.Column<bool>(type: "boolean", nullable: false),
                    Visible = table.Column<bool>(type: "boolean", nullable: false),
                    FileID = table.Column<int>(type: "integer", nullable: true),
                    ScenarioID = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MenuItem_File",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MenuItem_Parent",
                        column: x => x.ParentID,
                        principalTable: "MenuItems",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    TransformID = table.Column<int>(type: "integer", nullable: false),
                    IsGrabbable = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Models_Files",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Signs",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    TransformID = table.Column<int>(type: "integer", nullable: false),
                    IsCallout = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Signs", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Signs_Files",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Stations",
                columns: table => new
                {
                    TransformID = table.Column<int>(type: "integer", nullable: false),
                    FileID = table.Column<int>(type: "integer", nullable: false),
                    Rotation = table.Column<float[]>(type: "real[]", nullable: false),
                    Latitude = table.Column<float>(type: "real", nullable: false),
                    Longitude = table.Column<float>(type: "real", nullable: false),
                    Altitude = table.Column<float>(type: "real", nullable: false),
                    Zone = table.Column<string>(type: "text", nullable: false, defaultValueSql: "''::text")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Stations_pkey", x => x.TransformID);
                    table.ForeignKey(
                        name: "FK_Stations_Files",
                        column: x => x.FileID,
                        principalTable: "Files",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Scenarios",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false, defaultValueSql: "nextval('\"Activities_ID_seq\"'::regclass)"),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "now()"),
                    StartStationID = table.Column<int>(type: "integer", nullable: true),
                    StartRotation = table.Column<float>(type: "real", nullable: false),
                    LanguageID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Scenarios", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Scenario_Language",
                        column: x => x.LanguageID,
                        principalTable: "Languages",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Scenario_StartStation",
                        column: x => x.StartStationID,
                        principalTable: "Stations",
                        principalColumn: "TransformID",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "StationConnections",
                columns: table => new
                {
                    FromStationID = table.Column<int>(type: "integer", nullable: false),
                    ToStationID = table.Column<int>(type: "integer", nullable: false),
                    Label = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("StationConnections_pkey", x => new { x.FromStationID, x.ToStationID });
                    table.ForeignKey(
                        name: "FK_StationConnection_From",
                        column: x => x.FromStationID,
                        principalTable: "Stations",
                        principalColumn: "TransformID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StationConnection_To",
                        column: x => x.ToStationID,
                        principalTable: "Stations",
                        principalColumn: "TransformID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Transforms",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Matrix = table.Column<float[]>(type: "real[]", nullable: false, defaultValueSql: "'{1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1}'::real[]"),
                    ParentTransformID = table.Column<int>(type: "integer", nullable: true),
                    ScenarioID = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transforms", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Transform_Scenario",
                        column: x => x.ScenarioID,
                        principalTable: "Scenarios",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transforms_ParentTransforms",
                        column: x => x.ParentTransformID,
                        principalTable: "Transforms",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "AudioTracks_FileID_index",
                table: "AudioTracks",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "AudioTracks_TransformID_index",
                table: "AudioTracks",
                column: "TransformID");

            migrationBuilder.CreateIndex(
                name: "filecontents_fileid_index",
                table: "FileContents",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "FileTags_ID_Name__IDX",
                table: "FileTags",
                columns: new[] { "ID", "Name" });

            migrationBuilder.CreateIndex(
                name: "FileTags_Name_unq",
                table: "FileTags",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "fki_Metadata_Files",
                table: "GSVMetadata",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "GSVMetadata_unique_pano",
                table: "GSVMetadata",
                column: "Pano",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HeadsetLocations_HeadsetID",
                table: "HeadsetLocations",
                column: "HeadsetID");

            migrationBuilder.CreateIndex(
                name: "fki_FK_MenuItem_Scenario",
                table: "MenuItems",
                columns: new[] { "ID", "ScenarioID" });

            migrationBuilder.CreateIndex(
                name: "IDX_MenuItems__ID_FileID",
                table: "MenuItems",
                columns: new[] { "ID", "FileID" });

            migrationBuilder.CreateIndex(
                name: "IDX_MenuItems__ID_ParentID",
                table: "MenuItems",
                columns: new[] { "ID", "ParentID" });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_FileID",
                table: "MenuItems",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_ParentID",
                table: "MenuItems",
                column: "ParentID");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_ScenarioID",
                table: "MenuItems",
                column: "ScenarioID");

            migrationBuilder.CreateIndex(
                name: "Models_FileID_index",
                table: "Models",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "Models_TransformID_index",
                table: "Models",
                column: "TransformID");

            migrationBuilder.CreateIndex(
                name: "fki_FK_Scenario_Language",
                table: "Scenarios",
                columns: new[] { "ID", "LanguageID" });

            migrationBuilder.CreateIndex(
                name: "fki_FK_Scenario_StartStation",
                table: "Scenarios",
                column: "StartStationID");

            migrationBuilder.CreateIndex(
                name: "IX_Scenarios_LanguageID",
                table: "Scenarios",
                column: "LanguageID");

            migrationBuilder.CreateIndex(
                name: "Signs_FileID_index",
                table: "Signs",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "Signs_TransformID_index",
                table: "Signs",
                column: "TransformID");

            migrationBuilder.CreateIndex(
                name: "StationConnections_FromStationID_index",
                table: "StationConnections",
                column: "FromStationID");

            migrationBuilder.CreateIndex(
                name: "StationConnections_ToStationID_index",
                table: "StationConnections",
                column: "ToStationID");

            migrationBuilder.CreateIndex(
                name: "fki_Stations_Transforms",
                table: "Stations",
                column: "TransformID");

            migrationBuilder.CreateIndex(
                name: "stations_fileid_index",
                table: "Stations",
                column: "FileID");

            migrationBuilder.CreateIndex(
                name: "_TagOnFile___FileID__IDX",
                table: "TagOnFile",
                columns: new[] { "FileID", "TagID" });

            migrationBuilder.CreateIndex(
                name: "IX_TagOnFile_TagID",
                table: "TagOnFile",
                column: "TagID");

            migrationBuilder.CreateIndex(
                name: "fki_FK_Transform_Scenario",
                table: "Transforms",
                column: "ScenarioID");

            migrationBuilder.CreateIndex(
                name: "fki_FK_Transforms_ParentTransforms",
                table: "Transforms",
                column: "ParentTransformID");

            migrationBuilder.AddForeignKey(
                name: "FK_AudioTracks_Transforms",
                table: "AudioTracks",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_Scenario",
                table: "MenuItems",
                column: "ScenarioID",
                principalTable: "Scenarios",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Models_Transforms",
                table: "Models",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Signs_Transforms",
                table: "Signs",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stations_Transforms",
                table: "Stations",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Stations_Files",
                table: "Stations");

            migrationBuilder.DropForeignKey(
                name: "FK_Stations_Transforms",
                table: "Stations");

            migrationBuilder.DropTable(
                name: "AudioTracks");

            migrationBuilder.DropTable(
                name: "FileContents");

            migrationBuilder.DropTable(
                name: "GSVMetadata");

            migrationBuilder.DropTable(
                name: "HeadsetLocations");

            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropTable(
                name: "Settings");

            migrationBuilder.DropTable(
                name: "Signs");

            migrationBuilder.DropTable(
                name: "StationConnections");

            migrationBuilder.DropTable(
                name: "TagOnFile");

            migrationBuilder.DropTable(
                name: "WebRTC");

            migrationBuilder.DropTable(
                name: "Headsets");

            migrationBuilder.DropTable(
                name: "FileTags");

            migrationBuilder.DropTable(
                name: "Files");

            migrationBuilder.DropTable(
                name: "Transforms");

            migrationBuilder.DropTable(
                name: "Scenarios");

            migrationBuilder.DropTable(
                name: "Languages");

            migrationBuilder.DropTable(
                name: "Stations");

            migrationBuilder.DropSequence(
                name: "Activities_ID_seq");

            migrationBuilder.DropSequence(
                name: "Errors_ID_seq");
        }
    }
}
