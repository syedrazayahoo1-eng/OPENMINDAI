# FRONTEND.md

## Pages
- `LandingPage`: 3D elements, overview.
- `Login/Register`: Auth.
- `Dashboard`: Main hub.
- `AIAgents`, `AIReplies`, `CRM`, `Attendance`, `Employees`, `Leaves`, `Reviews`: Domain modules.

## Components
- Divided into domains (`ai`, `attendance`, `auth`, `crm`, `dashboard`, `employees`, `leaves`, `reviews`, `ui`).

## State Management
- React Context (`AuthContext`) + TanStack Query for server-side state.
