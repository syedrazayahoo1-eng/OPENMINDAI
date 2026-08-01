# DEVELOPMENT_RULES.md

This file serves as the permanent development contract for the OpenMindAI project. All contributions must adhere to these rules.

# General Rules

- Never rewrite completed modules unless explicitly requested.
- Never redesign the project architecture.
- Never rename folders without approval.
- Never remove working code.
- Always preserve existing functionality.

# Code Generation Rules

- Always generate COMPLETE replacement files.
- Never generate partial code snippets.
- Never use placeholders like "...existing code..."
- Every generated file must be production ready.
- Every file must compile without modification.

# UI Rules

- Enterprise-level UI only.
- Fully responsive.
- Consistent spacing.
- Consistent typography.
- Modern animations.
- Accessibility compliant.
- Dark/light mode compatible if already implemented.
- Never break responsive layouts.

# Backend Rules

- Follow existing architecture.
- Maintain dependency injection.
- Proper logging.
- Proper exception handling.
- Proper validation.
- Clean architecture principles.

# Database Rules

- Never lose data.
- Safe migrations only.
- Proper indexing.
- Proper foreign keys.
- Backward compatibility.

# Security Rules

- JWT best practices.
- Never expose secrets.
- Validate all inputs.
- Parameterized database queries.
- OWASP compliance.

# Performance Rules

- Avoid unnecessary renders.
- Lazy load where appropriate.
- Optimize API calls.
- Efficient database queries.
- Minimize bundle size.

# Workflow Rules

Before every task:

1. Read PROJECT_MEMORY.md
2. Read DEVELOPMENT_RULES.md
3. Understand the request
4. Plan internally
5. Generate production-ready code
