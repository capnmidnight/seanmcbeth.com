using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Yarrow.Migrations
{
    public partial class ConnectionTransforms : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AudioTracks_Files",
                table: "AudioTracks");

            migrationBuilder.DropForeignKey(
                name: "FK_AudioTracks_Transforms",
                table: "AudioTracks");

            migrationBuilder.DropForeignKey(
                name: "FK_FileContents_Files",
                table: "FileContents");

            migrationBuilder.DropForeignKey(
                name: "FK_HeadsetLocations_to_Headsets",
                table: "HeadsetLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_File",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_Parent",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_Scenario",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Models_Files",
                table: "Models");

            migrationBuilder.DropForeignKey(
                name: "FK_Models_Transforms",
                table: "Models");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenario_Language",
                table: "Scenarios");

            migrationBuilder.DropForeignKey(
                name: "FK_Signs_Files",
                table: "Signs");

            migrationBuilder.DropForeignKey(
                name: "FK_Signs_Transforms",
                table: "Signs");

            migrationBuilder.DropForeignKey(
                name: "FK_StationConnection_From",
                table: "StationConnections");

            migrationBuilder.DropForeignKey(
                name: "FK_StationConnection_To",
                table: "StationConnections");

            migrationBuilder.DropForeignKey(
                name: "FK_Stations_Files",
                table: "Stations");

            migrationBuilder.DropForeignKey(
                name: "FK_Stations_Transforms",
                table: "Stations");

            migrationBuilder.DropForeignKey(
                name: "FK_Transform_Scenario",
                table: "Transforms");

            migrationBuilder.DropForeignKey(
                name: "FK_Transforms_ParentTransforms",
                table: "Transforms");

            migrationBuilder.AddColumn<int>(
                name: "TransformID",
                table: "StationConnections",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "StationConnections_TransformID_index",
                table: "StationConnections",
                column: "TransformID");

            migrationBuilder.AddForeignKey(
                name: "FK_AudioTracks_Files",
                table: "AudioTracks",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AudioTracks_Transforms",
                table: "AudioTracks",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_FileContents_Files",
                table: "FileContents",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_HeadsetLocations_to_Headsets",
                table: "HeadsetLocations",
                column: "HeadsetID",
                principalTable: "Headsets",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_File",
                table: "MenuItems",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_Parent",
                table: "MenuItems",
                column: "ParentID",
                principalTable: "MenuItems",
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
                name: "FK_Models_Files",
                table: "Models",
                column: "FileID",
                principalTable: "Files",
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
                name: "FK_Scenario_Language",
                table: "Scenarios",
                column: "LanguageID",
                principalTable: "Languages",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Signs_Files",
                table: "Signs",
                column: "FileID",
                principalTable: "Files",
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
                name: "FK_StationConnection_From",
                table: "StationConnections",
                column: "FromStationID",
                principalTable: "Stations",
                principalColumn: "TransformID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StationConnection_To",
                table: "StationConnections",
                column: "ToStationID",
                principalTable: "Stations",
                principalColumn: "TransformID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StationConnection_Transform",
                table: "StationConnections",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stations_Files",
                table: "Stations",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Stations_Transforms",
                table: "Stations",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transform_Scenario",
                table: "Transforms",
                column: "ScenarioID",
                principalTable: "Scenarios",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transforms_ParentTransforms",
                table: "Transforms",
                column: "ParentTransformID",
                principalTable: "Transforms",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AudioTracks_Files",
                table: "AudioTracks");

            migrationBuilder.DropForeignKey(
                name: "FK_AudioTracks_Transforms",
                table: "AudioTracks");

            migrationBuilder.DropForeignKey(
                name: "FK_FileContents_Files",
                table: "FileContents");

            migrationBuilder.DropForeignKey(
                name: "FK_HeadsetLocations_to_Headsets",
                table: "HeadsetLocations");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_File",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_Parent",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItem_Scenario",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_Models_Files",
                table: "Models");

            migrationBuilder.DropForeignKey(
                name: "FK_Models_Transforms",
                table: "Models");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenario_Language",
                table: "Scenarios");

            migrationBuilder.DropForeignKey(
                name: "FK_Signs_Files",
                table: "Signs");

            migrationBuilder.DropForeignKey(
                name: "FK_Signs_Transforms",
                table: "Signs");

            migrationBuilder.DropForeignKey(
                name: "FK_StationConnection_From",
                table: "StationConnections");

            migrationBuilder.DropForeignKey(
                name: "FK_StationConnection_To",
                table: "StationConnections");

            migrationBuilder.DropForeignKey(
                name: "FK_StationConnection_Transform",
                table: "StationConnections");

            migrationBuilder.DropForeignKey(
                name: "FK_Stations_Files",
                table: "Stations");

            migrationBuilder.DropForeignKey(
                name: "FK_Stations_Transforms",
                table: "Stations");

            migrationBuilder.DropForeignKey(
                name: "FK_Transform_Scenario",
                table: "Transforms");

            migrationBuilder.DropForeignKey(
                name: "FK_Transforms_ParentTransforms",
                table: "Transforms");

            migrationBuilder.DropIndex(
                name: "StationConnections_TransformID_index",
                table: "StationConnections");

            migrationBuilder.DropColumn(
                name: "TransformID",
                table: "StationConnections");

            migrationBuilder.AddForeignKey(
                name: "FK_AudioTracks_Files",
                table: "AudioTracks",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_AudioTracks_Transforms",
                table: "AudioTracks",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_FileContents_Files",
                table: "FileContents",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_HeadsetLocations_to_Headsets",
                table: "HeadsetLocations",
                column: "HeadsetID",
                principalTable: "Headsets",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_File",
                table: "MenuItems",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_Parent",
                table: "MenuItems",
                column: "ParentID",
                principalTable: "MenuItems",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItem_Scenario",
                table: "MenuItems",
                column: "ScenarioID",
                principalTable: "Scenarios",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Models_Files",
                table: "Models",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Models_Transforms",
                table: "Models",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenario_Language",
                table: "Scenarios",
                column: "LanguageID",
                principalTable: "Languages",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Signs_Files",
                table: "Signs",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Signs_Transforms",
                table: "Signs",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_StationConnection_From",
                table: "StationConnections",
                column: "FromStationID",
                principalTable: "Stations",
                principalColumn: "TransformID");

            migrationBuilder.AddForeignKey(
                name: "FK_StationConnection_To",
                table: "StationConnections",
                column: "ToStationID",
                principalTable: "Stations",
                principalColumn: "TransformID");

            migrationBuilder.AddForeignKey(
                name: "FK_Stations_Files",
                table: "Stations",
                column: "FileID",
                principalTable: "Files",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Stations_Transforms",
                table: "Stations",
                column: "TransformID",
                principalTable: "Transforms",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Transform_Scenario",
                table: "Transforms",
                column: "ScenarioID",
                principalTable: "Scenarios",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Transforms_ParentTransforms",
                table: "Transforms",
                column: "ParentTransformID",
                principalTable: "Transforms",
                principalColumn: "ID");
        }
    }
}
