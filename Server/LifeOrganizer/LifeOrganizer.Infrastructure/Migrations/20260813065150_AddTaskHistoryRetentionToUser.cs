using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeOrganizer.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskHistoryRetentionToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TaskHistoryRetentionDays",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TaskHistoryRetentionDays",
                table: "Users");
        }
    }
}
