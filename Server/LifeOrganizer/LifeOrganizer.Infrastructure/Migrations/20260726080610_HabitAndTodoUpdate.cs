using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LifeOrganizer.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class HabitAndTodoUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HabitCompletion_Habits_HabitId",
                table: "HabitCompletion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HabitCompletion",
                table: "HabitCompletion");

            migrationBuilder.RenameTable(
                name: "HabitCompletion",
                newName: "HabitCompletions");

            migrationBuilder.RenameIndex(
                name: "IX_HabitCompletion_HabitId_Date",
                table: "HabitCompletions",
                newName: "IX_HabitCompletions_HabitId_Date");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TodoItems",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Habits",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_HabitCompletions",
                table: "HabitCompletions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HabitCompletions_Habits_HabitId",
                table: "HabitCompletions",
                column: "HabitId",
                principalTable: "Habits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HabitCompletions_Habits_HabitId",
                table: "HabitCompletions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HabitCompletions",
                table: "HabitCompletions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TodoItems");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Habits");

            migrationBuilder.RenameTable(
                name: "HabitCompletions",
                newName: "HabitCompletion");

            migrationBuilder.RenameIndex(
                name: "IX_HabitCompletions_HabitId_Date",
                table: "HabitCompletion",
                newName: "IX_HabitCompletion_HabitId_Date");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HabitCompletion",
                table: "HabitCompletion",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HabitCompletion_Habits_HabitId",
                table: "HabitCompletion",
                column: "HabitId",
                principalTable: "Habits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
