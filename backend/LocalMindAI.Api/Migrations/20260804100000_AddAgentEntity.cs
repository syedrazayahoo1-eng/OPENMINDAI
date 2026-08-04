using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocalMindAI.Api.Migrations;

public partial class AddAgentEntity : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Agents",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false).Annotation("SqlServer:Identity", "1, 1"),
                Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                Initials = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                Department = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                Status = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                CurrentTask = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                Performance = table.Column<int>(type: "int", nullable: false),
                Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                LastActiveAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                Models = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                Tone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                Temperature = table.Column<decimal>(type: "decimal(4,3)", nullable: false),
                MaxTokens = table.Column<int>(type: "int", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
            },
            constraints: table => table.PrimaryKey("PK_Agents", x => x.Id));
    }

    protected override void Down(MigrationBuilder migrationBuilder) => migrationBuilder.DropTable(name: "Agents");
}
