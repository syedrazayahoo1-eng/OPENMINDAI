# DIGITECH V2 production release guide

## Target architecture

Azure Front Door (WAF, custom domain and managed TLS) routes HTTPS traffic to separate Linux App Services for the React web app and .NET API. The API uses Azure SQL Database, Azure Cache for Redis (distributed cache and SignalR backplane), private Azure Blob Storage, Key Vault, Application Insights and Azure OpenAI. Place all resources in one primary region close to users and enable paired-region recovery; for an India-first deployment, start with Central India and use South India for recovery after validating service availability.

## Naming and deployment order

Use `digitech-{environment}-{region}-{service}`: for example `digitech-prod-cin-api`, `digitech-prod-cin-sql`, `digitech-prod-cin-kv`.

1. Create resource group, VNet/private endpoints, Log Analytics and Application Insights.
2. Create Key Vault, storage account/container (`uploads`, private), Azure SQL, Redis and App Service plan.
3. Grant API managed identity Key Vault Secrets User and Storage Blob Data Contributor; configure SQL Entra access.
4. Create App Service deployment slots, Front Door/WAF, custom domains and managed certificates.
5. Store secrets, apply migrations from a controlled release job, deploy staging images, verify `/healthz`, then swap slots.

## Required Key Vault secrets

`Jwt--Key`, `ConnectionStrings--DefaultConnection`, `Redis--ConnectionString`, `Storage--AzureBlob--ConnectionString` (or use managed identity URI), `AzureOpenAI--Endpoint`, `AzureOpenAI--ApiKey`, `AzureOpenAI--DeploymentName`, `GoogleBusiness--ClientId`, `GoogleBusiness--ClientSecret`, `WorkflowExecution--Smtp--Username`, `WorkflowExecution--Smtp--Password`, `WorkflowExecution--Teams--WebhookUrl`, and `ApplicationInsights--ConnectionString`.

Do not place these values in App Service files, GitHub variables, images, or deployment logs. Configure `KeyVault__Uri`, non-secret storage URI, trusted CORS origins and `ASPNETCORE_ENVIRONMENT=Production` as App Service settings.

## App Service configuration

- Linux Premium v3 plan, at least two instances; Always On, HTTPS Only, HTTP/2 and WebSockets enabled.
- Minimum TLS 1.2, ARR affinity disabled for the API when Redis SignalR backplane is active.
- Configure `/healthz` as health-check path and staging slot swaps. Do not set a custom startup command; the container entrypoint is authoritative.
- Front Door WAF is the public edge. Restrict App Service inbound traffic to Front Door/private ingress.

## Data, cache and storage

- Azure SQL: General Purpose provisioned compute for sustained traffic; automatic backups with point-in-time restore, long-term retention and geo-replication for critical production data. Enable zone redundancy where available. The API already enables SQL retry-on-failure.
- Redis: Standard C1 minimum; Premium/Enterprise for zone redundancy, persistence, private networking and production SignalR scale. Use TLS only and retain the existing singleton connection/backplane configuration.
- Blob: private `uploads` container; deny public access, use managed identity, enable soft delete/versioning and lifecycle Hot-to-Cool after 30–90 days.

## Data Protection key persistence

The API encrypts MFA secrets and encrypted integration configuration with ASP.NET Core Data Protection. The Docker Compose deployment persists the key ring at `/app/App_Data/DataProtection-Keys` through the durable `backend_data_protection_keys` volume. Do not store generated key-ring XML in source control, container images, or application uploads.

For Azure App Service, configure an equivalently durable, access-controlled key-ring provider before enabling MFA or storing encrypted integration configuration. Azure Blob Storage protected with Key Vault is the recommended production option; the existing Azure infrastructure must grant the API managed identity only the required storage and key-access permissions.

## Observability and AI

Set `ApplicationInsights__ConnectionString`; request/dependency/exception telemetry, workflow metrics, AI timing, Google timing, correlation IDs and monitoring SignalR events are emitted by the existing platform. Enable adaptive sampling, availability tests for `/healthz`, and alerts for failed workflows, dependency failures, high latency, memory and CPU.

## Domain, OAuth and CORS

Point `app.example.com` to Front Door, enable a managed certificate, and set the exact public origins in `Cors__AllowedOrigins`. Register Google OAuth callback as `https://api.example.com/api/google/callback`; validate the production redirect URI in Google Cloud before release. Configure SMTP sender domain/DKIM outside the application.

## Go-live checklist

- [ ] Key Vault secrets, managed-identity roles and private endpoints validated.
- [ ] SQL migration applied and restore tested.
- [ ] Redis TLS/backplane and Blob private-container access verified.
- [ ] App Service health checks, Always On, WebSockets, HTTPS, TLS and slot settings verified.
- [ ] Front Door WAF, custom domains, certificates and exact CORS origins validated.
- [ ] Application Insights alerts/dashboards and log retention configured.
- [ ] Azure OpenAI, Google OAuth, SMTP and Teams verified in production-safe test accounts.
- [ ] Staging smoke test, SignalR reconnect test and rollback owner approved.

## Rollback and disaster recovery

Rollback by swapping the prior healthy App Service slot back to production; do not redeploy over a failing slot. Preserve deployment logs and correlation IDs. For data recovery, isolate the incident, revoke OAuth/JWT secrets if needed, restore Azure SQL to a point-in-time database, validate it in a recovery slot, then switch connection settings through Key Vault. Restore blobs through soft delete/versioning and Redis from Premium persistence only when cache loss cannot be tolerated.

## Directional monthly cost

Pricing varies by region, consumption, reservations, egress and AI token use. A Linux Premium v3 P0v3 is publicly listed around US$62/month and P1v3 capacity is higher; two production instances, Azure SQL, Redis, Front Door/WAF, logs and Azure OpenAI commonly make a baseline production estate roughly US$350–$1,200+/month before AI tokens and outbound traffic. Use the Azure Pricing Calculator for the selected region and workload. [Azure App Service pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/linux/) and [Azure Cache for Redis pricing](https://azure.microsoft.com/en-us/pricing/details/cache/) are the pricing references.

## Readiness score

**86/100 — ready for controlled staging release.** Complete the React Router advisory remediation, execute the k6 suite against staging, validate Bicep with Azure CLI, and perform the checklist above before production go-live.
