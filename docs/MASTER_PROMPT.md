# MASTER_PROMPT.md

This document serves as the permanent AI operating manual for the OpenMindAI project. It is intended to guide all future developers (AI or human) to maintain consistency, architecture, and quality.

====================================================

# PROJECT IDENTITY

- **Project Name:** OpenMindAI
- **Purpose:** Streamline business operations including CRM, AI-driven review management, employee/attendance tracking, and workforce management.
- **Business Goal:** To provide a robust, AI-powered enterprise SaaS platform for small-to-medium businesses.
- **Current Completion %:** 65%
- **Technology Stack:** React 19 (Vite), ASP.NET Core (.NET 10), SQL Server, Entity Framework Core, TailwindCSS, Framer Motion.
- **Architecture:** Layered RESTful API (Backend) + SPA (Frontend).
- **Folder Structure:** See root directory and `/docs` for breakdown.

====================================================

# PERMANENT DEVELOPMENT RULES

- Never redesign existing architecture.
- Never rewrite completed modules.
- Never rename folders.
- Never remove working code.
- Always preserve compatibility.
- Always follow `PROJECT_MEMORY.md`.
- Always follow `DEVELOPMENT_RULES.md`.
- Always follow `TASK_QUEUE.md`.

====================================================

# CODING STANDARD

- **Frontend:** React functional components, hooks-based state management.
- **Backend:** C# conventions (PascalCase classes/methods, camelCase variables).
- **Database:** Migrations-first approach.
- **API:** RESTful endpoints using JSON.
- **Naming:** Consistent, semantic naming.
- **Comments:** Meaningful comments for non-obvious logic.
- **Logging:** Structured logging.
- **Validation:** Server-side validation using DTOs/Data Annotations.
- **Dependency Injection:** Mandatory for all services.
- **Error Handling:** Standardized error responses via middleware.
- **Animations:** Framer Motion for modern, professional feel.
- **Responsive UI:** TailwindCSS fluid layouts.
- **Accessibility:** Ensure basic accessibility compliance.

====================================================

# FILE GENERATION POLICY

- Always generate COMPLETE replacement files.
- Never generate snippets.
- Never generate placeholders (e.g., "...existing code...").
- Every file must compile immediately upon creation.
- Never assume missing code: assume the provided context is complete.

====================================================

# UI STANDARD

- **Style:** Enterprise SaaS UI.
- **Consistency:** Uniform spacing, typography, and color palette.
- **Responsiveness:** Fully adaptive layouts.
- **Theme:** Dark mode compatible.
- **Components:** Professional cards, tables, forms, and dashboard widgets.

====================================================

# BACKEND STANDARD

- **Clean Architecture:** Separation of concerns.
- **Dependency Injection:** Used for all service lifetimes.
- **DTOs:** Used for all API request/response contracts.
- **Validation:** Enforced at entry points.
- **JWT:** Standardized Bearer Authentication.

====================================================

# DATABASE STANDARD

- **Safe migrations:** Always generate backward-compatible changes.
- **Schema:** Proper use of foreign keys and indexes.

====================================================

# SECURITY STANDARD

- **OWASP:** Adhere to top 10 recommendations.
- **Secrets:** Strictly managed via environment variables (no hardcoding).
- **Inputs:** Validated and parameterized queries only.
- **Transport:** CORS policy strictly enforced for production.

====================================================

# DEVELOPMENT WORKFLOW

Before EVERY task:

1. Read `PROJECT_MEMORY.md`
2. Read `DEVELOPMENT_RULES.md`
3. Read `PROJECT_STATUS.md`
4. Read `TASK_QUEUE.md`
5. Read `MASTER_PROMPT.md`
6. Understand request
7. Plan internally
8. Generate production-ready code

====================================================

# ABSOLUTE RULE

- Never start coding until all documentation has been loaded.
- Always use `TASK_QUEUE.md` to determine the next logical feature.
