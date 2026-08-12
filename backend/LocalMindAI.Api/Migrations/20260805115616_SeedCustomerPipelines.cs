using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LocalMindAI.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedCustomerPipelines : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "CustomerPipelines",
                columns: new[] { "Id", "IsActive", "Name", "SortOrder" },
                values: new object[,]
                {
                    { 1, true, "Lead", 1 },
                    { 2, true, "Qualified", 2 },
                    { 3, true, "Proposal", 3 },
                    { 4, true, "Negotiation", 4 },
                    { 5, true, "Won", 5 },
                    { 6, true, "Lost", 6 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "CustomerPipelines",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "CustomerPipelines",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "CustomerPipelines",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "CustomerPipelines",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "CustomerPipelines",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "CustomerPipelines",
                keyColumn: "Id",
                keyValue: 6);
        }
    }
}
