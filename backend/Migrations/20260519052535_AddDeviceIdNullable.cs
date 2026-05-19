using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDeviceIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeviceId",
                table: "Complaints",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Complaints_DeviceId",
                table: "Complaints",
                column: "DeviceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Complaints_Devices_DeviceId",
                table: "Complaints",
                column: "DeviceId",
                principalTable: "Devices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Complaints_Devices_DeviceId",
                table: "Complaints");

            migrationBuilder.DropIndex(
                name: "IX_Complaints_DeviceId",
                table: "Complaints");

            migrationBuilder.DropColumn(
                name: "DeviceId",
                table: "Complaints");
        }
    }
}
