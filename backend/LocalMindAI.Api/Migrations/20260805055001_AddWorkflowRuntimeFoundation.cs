using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocalMindAI.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddWorkflowRuntimeFoundation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Workflows",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurrentStep",
                table: "WorkflowExecutions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Error",
                table: "WorkflowExecutions",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "WorkflowExecutions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAt",
                table: "WorkflowExecutions",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WorkflowExecutionLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    WorkflowExecutionId = table.Column<int>(type: "INTEGER", nullable: false),
                    WorkflowId = table.Column<int>(type: "INTEGER", nullable: false),
                    StepName = table.Column<string>(type: "TEXT", nullable: false),
                    Level = table.Column<string>(type: "TEXT", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkflowExecutionLogs", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WorkflowExecutionLogs");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Workflows");

            migrationBuilder.DropColumn(
                name: "CurrentStep",
                table: "WorkflowExecutions");

            migrationBuilder.DropColumn(
                name: "Error",
                table: "WorkflowExecutions");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "WorkflowExecutions");

            migrationBuilder.DropColumn(
                name: "StartedAt",
                table: "WorkflowExecutions");
        }
    }
}
