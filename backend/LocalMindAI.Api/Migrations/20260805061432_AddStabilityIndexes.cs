using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LocalMindAI.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStabilityIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WorkflowExecutions_WorkflowId",
                table: "WorkflowExecutions");

            migrationBuilder.CreateIndex(
                name: "IX_Workflows_Status_UpdatedAt",
                table: "Workflows",
                columns: new[] { "Status", "UpdatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkflowExecutions_WorkflowId_CreatedAt",
                table: "WorkflowExecutions",
                columns: new[] { "WorkflowId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkflowExecutionLogs_WorkflowExecutionId_CreatedAt",
                table: "WorkflowExecutionLogs",
                columns: new[] { "WorkflowExecutionId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CreatedAt",
                table: "Reviews",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Agents_Status_UpdatedAt",
                table: "Agents",
                columns: new[] { "Status", "UpdatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Workflows_Status_UpdatedAt",
                table: "Workflows");

            migrationBuilder.DropIndex(
                name: "IX_WorkflowExecutions_WorkflowId_CreatedAt",
                table: "WorkflowExecutions");

            migrationBuilder.DropIndex(
                name: "IX_WorkflowExecutionLogs_WorkflowExecutionId_CreatedAt",
                table: "WorkflowExecutionLogs");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_CreatedAt",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Agents_Status_UpdatedAt",
                table: "Agents");

            migrationBuilder.CreateIndex(
                name: "IX_WorkflowExecutions_WorkflowId",
                table: "WorkflowExecutions",
                column: "WorkflowId");
        }
    }
}
