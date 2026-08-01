# SECURITY.md

## Vulnerabilities
- JWT secret management (ensure environment variables are used).
- CORS policy: `AllowAnyOrigin()` should be restricted in production.

## Recommendations
- Enforce strict CORS.
- Add input validation.
- Implement rate limiting.
