# ARCHITECTURE.md

## System Diagram
```text
[Frontend (React/Vite)] <---> [REST API (ASP.NET Core)] <---> [SQL Server]
                                    |
                            [AI/External Services]
```

## Backend Architecture
- Layered approach:
    - `Controllers`: Entry points for API requests.
    - `Services`: Business logic implementation.
    - `Models`: Data representations.
    - `Data`: EF Core DbContext.

## Frontend Architecture
- `components`: Reusable UI elements (divided by domain).
- `pages`: Page-level components associated with routes.
- `hooks`: Reusable logic.
- `services`: API interaction wrappers.
- `context`: Global state management.
