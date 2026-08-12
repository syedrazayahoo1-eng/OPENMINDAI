using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocalMindAI.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIntegrationCenter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IntegrationConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Provider = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    EncryptedConfiguration = table.Column<string>(type: "TEXT", nullable: false),
                    PublicConfiguration = table.Column<string>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    LastTestMessage = table.Column<string>(type: "TEXT", nullable: true),
                    LastTestedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntegrationConfigurations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationConfigurations_Provider",
                table: "IntegrationConfigurations",
                column: "Provider",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IntegrationConfigurations");
        }
    }
}
