using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeOrganizer.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPushTokenForNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PushToken",
                table: "Users",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PushToken",
                table: "Users");
        }
    }
}
