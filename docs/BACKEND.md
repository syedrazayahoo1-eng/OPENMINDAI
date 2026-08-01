# BACKEND.md

## Controllers
- `AuthController`: User management.
- `ChatController`: Messaging.
- `ReviewsController`: (Empty) Review management.
- `HealthController`: Monitoring.

## Services
- `AIService`: AI interaction logic.
- `IReviewService`, `IAIService`, etc.

## Dependency Injection
- Used extensively in `Program.cs` to manage service lifetimes (scoped, singleton, transient).
