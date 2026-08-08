# DIGITECH V2 RC2 Certification Audit

**Decision: Not production certified.**

The release builds successfully, but the production dependency scan reports two high-severity React Router advisories. Certification requires a clean high/critical dependency audit or an approved, documented exception.

## Scores

| Category | Score |
|---|---:|
| Overall production readiness | 78/100 |
| Security | 74/100 |
| Performance | 76/100 |
| Architecture | 81/100 |
| Maintainability | 75/100 |
| Scalability | 79/100 |

## Verified results

- `dotnet build -c Release --no-restore`: pass, zero warnings and zero errors.
- `dotnet ef database update`: pass against the configured SQLite development database; no pending migrations.
- `npm run lint`: pass.
- `npm run build`: pass. Vite reports its existing non-blocking large-chunk advisory.
- Authentication fallback policy: authenticated by default, with explicit anonymous authentication/OAuth/health endpoints.
- JWT validation, refresh-token rotation/reuse detection, secure HttpOnly refresh cookie, SignalR authorization, rate limiting, CSP/security headers, and workflow outbound HTTPS/host/port restrictions are present.
- EF Core indexes cover users, refresh tokens, customers, reviews, replies, posts, images, scheduled posts, workflows, executions and execution logs.
- Azure SQL retry, optional Redis backplane/cache, Blob abstraction, Key Vault provider, Application Insights, health checks, monitoring endpoints, Docker files, Bicep template and GitHub Actions workflows are present.

## Critical issues

None identified by the available local verification.

## High issues

1. **Dependency security release gate** — `npm audit --omit=dev --audit-level=high` reports two high-severity advisories for `react-router` 7.12.0–8.2.0. The latest available compatible `react-router-dom` release is 7.18.2; the audit-recommended 7.11.0 has different high-severity advisories. No compatible zero-high version was available during this audit.

## Medium issues

1. Docker Compose validation and container health checks were not executed because Docker CLI is not installed on this workstation.
2. Bicep validation was not executed because Azure CLI/Bicep CLI is unavailable.
3. Azure SQL, Redis, Blob, Key Vault, Application Insights, Azure OpenAI, Google OAuth/Business, SMTP and Teams require HTTPS staging credentials for operational validation.
4. Secure refresh-cookie transmission must be browser-tested on an HTTPS staging domain; it cannot be fully exercised over local HTTP.

## Low issues

1. The optional lazy-loaded globe asset remains larger than Vite's recommended chunk threshold.
2. Local SQLite WAL/SHM files should remain ignored and excluded from release commits.

## Certification conditions

Before production release, resolve or formally accept the React Router dependency advisory, validate Docker/Bicep in CI, perform HTTPS staging smoke tests for cookies and external providers, and commit the clean release state. Only then may the release be marked **DIGITECH V2 RC2 – Production Certified**.
