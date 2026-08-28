using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeOrganizer.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPushNotificationEnabledToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PushNotificationsEnabled",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PushNotificationsEnabled",
                table: "Users");
        }
    }
}
