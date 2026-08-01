# PROJECT_MEMORY.md

## Purpose
OpenMindAI is a platform designed to streamline business operations, specifically focusing on CRM, AI-driven review management, employee/attendance tracking, and workforce management.

## Overall Architecture
- **Frontend:** React-based single-page application (SPA) using Vite, TailwindCSS, and Framer Motion.
- **Backend:** ASP.NET Core Web API (running on .NET 10).
- **Database:** SQL Server managed via Entity Framework Core.
- **Communication:** RESTful API using JSON.

## Technology Stack
- **Frontend:** React 19, React Router, TanStack Query, Framer Motion, TailwindCSS, Axios, Three.js (for landing page).
- **Backend:** .NET 10, ASP.NET Core, Entity Framework Core, SQL Server, JWT Authentication, BCrypt.
- **Tools:** Vite, ESLint.

## Coding Standards
- C# conventions for .NET (PascalCase for classes/methods, camelCase for variables).
- React components in `jsx`, functional components, hooks-based state management.

## UI Design Language
- Modern, clean, interactive (animations, 3D elements on landing page).
- Dark/Light mode considerations (implicitly handled by Tailwind).

## Authentication Flow
- JWT Bearer Authentication. Users register/login via `AuthController`, receiving a token stored on the client. Routes protected by `ProtectedRoute`.

## Database Flow
- EF Core Migrations are used to manage the SQL Server schema.

## Missing Modules / Known Issues
- `ReviewsController` is empty (0 bytes).
- `Review` model exists but is not in `ApplicationDbContext`.
- Potential scalability issues with current DB schema.

## Completion
Approximately 60-70% functional. Core auth and basic dashboard exist; advanced features (like AI-driven review replies) are in active development.
