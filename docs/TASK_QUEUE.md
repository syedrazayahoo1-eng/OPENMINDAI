# TASK_QUEUE.md

This file contains the enterprise development task queue for OpenMindAI.

---

## PHASE 1 — Critical Fixes

### Task ID: T-001
**Title:** Map Review Model to ApplicationDbContext
**Priority:** Critical
**Status:** Not Started
**Estimated Hours:** 2
**Dependencies:** None
**Affected Modules:** Backend, Database
**Frontend Files:** N/A
**Backend Files:** `backend/LocalMindAI.Api/Data/ApplicationDbContext.cs`
**Database Changes:** Add `DbSet<Review> Reviews`
**API Changes:** None
**Risk Level:** Low
**Testing Required:** Unit Test (Context), Integration Test
**Acceptance Criteria:** `Review` model is recognized by EF Core.

### Task ID: T-002
**Title:** Run Initial Migrations for Review Entity
**Priority:** Critical
**Status:** Not Started
**Estimated Hours:** 1
**Dependencies:** T-001
**Affected Modules:** Backend, Database
**Frontend Files:** N/A
**Backend Files:** N/A
**Database Changes:** Add Review Table via Migration
**API Changes:** None
**Risk Level:** Medium
**Testing Required:** Manual DB inspection
**Acceptance Criteria:** Review table exists in SQL Server.

---

## PHASE 2 — Core Backend

### Task ID: T-003
**Title:** Implement ReviewsController
**Priority:** Critical
**Status:** Not Started
**Estimated Hours:** 4
**Dependencies:** T-002
**Affected Modules:** Backend, API
**Frontend Files:** N/A
**Backend Files:** `backend/LocalMindAI.Api/Controllers/ReviewsController.cs`
**Database Changes:** None
**API Changes:** Implement GET, POST endpoints for Reviews
**Risk Level:** Medium
**Testing Required:** Integration Test (API)
**Acceptance Criteria:** CRUD operations for Reviews are functional via API.

### Task ID: T-004
**Title:** Implement ReviewService Business Logic
**Priority:** Critical
**Status:** Not Started
**Estimated Hours:** 4
**Dependencies:** T-003
**Affected Modules:** Backend
**Frontend Files:** N/A
**Backend Files:** `backend/LocalMindAI.Api/Services/ReviewService.cs`
**Database Changes:** None
**API Changes:** None
**Risk Level:** Low
**Testing Required:** Unit Test (Service)
**Acceptance Criteria:** Business logic for review handling is encapsulated.

### Task ID: T-005
**Title:** Implement Global Error Handling Middleware
**Priority:** High
**Status:** Not Started
**Estimated Hours:** 3
**Dependencies:** None
**Affected Modules:** Backend
**Frontend Files:** N/A
**Backend Files:** `backend/LocalMindAI.Api/Program.cs`
**Database Changes:** None
**API Changes:** None
**Risk Level:** Medium
**Testing Required:** Integration Test
**Acceptance Criteria:** API returns standardized error responses.

---

## PHASE 3 — Core Frontend

### Task ID: T-006
**Title:** Connect Reviews Page to Backend
**Priority:** High
**Status:** Not Started
**Estimated Hours:** 3
**Dependencies:** T-003
**Affected Modules:** Frontend
**Frontend Files:** `frontend/src/pages/Reviews.jsx`, `frontend/src/services/reviewservice.js`
**Backend Files:** N/A
**Database Changes:** None
**API Changes:** None
**Risk Level:** Low
**Testing Required:** Manual UI/Integration
**Acceptance Criteria:** Reviews are fetched and displayed.

### Task ID: T-007
**Title:** Connect AI Replies Page to Backend
**Priority:** High
**Status:** Not Started
**Estimated Hours:** 3
**Dependencies:** T-004
**Affected Modules:** Frontend
**Frontend Files:** `frontend/src/pages/AIReplies.jsx`
**Backend Files:** N/A
**Database Changes:** None
**API Changes:** None
**Risk Level:** Low
**Testing Required:** Manual UI/Integration
**Acceptance Criteria:** AI Reply functionality is operational.

---

## PHASE 4 — AI Features

### Task ID: T-008
**Title:** Robust AI Service Implementation
**Priority:** Medium
**Status:** Not Started
**Estimated Hours:** 6
**Dependencies:** None
**Affected Modules:** Backend, AI Service
**Frontend Files:** N/A
**Backend Files:** `backend/LocalMindAI.Api/Services/AIService.cs`
**Database Changes:** None
**API Changes:** None
**Risk Level:** Medium
**Testing Required:** Unit/Integration Test
**Acceptance Criteria:** AI interactions are resilient and error-handled.

### Task ID: T-009
**Title:** Implement AI Request Caching
**Priority:** Medium
**Status:** Not Started
**Estimated Hours:** 3
**Dependencies:** T-008
**Affected Modules:** Backend
**Frontend Files:** N/A
**Backend Files:** `backend/LocalMindAI.Api/Services/AIService.cs`
**Database Changes:** Redis or In-Memory Cache
**API Changes:** None
**Risk Level:** Medium
**Testing Required:** Load Test
**Acceptance Criteria:** Repeated AI requests are served from cache.

---

## PHASE 5 — Enterprise Features

### Task ID: T-010
**Title:** Implement Leave Management Module
**Priority:** Medium
**Status:** Not Started
**Estimated Hours:** 8
**Dependencies:** None
**Affected Modules:** Backend, Frontend
**Frontend Files:** `frontend/src/pages/Leaves.jsx`
**Backend Files:** New Controller/Service
**Database Changes:** New Leave tables
**API Changes:** Full CRUD
**Risk Level:** Medium
**Testing Required:** Full Integration
**Acceptance Criteria:** Leave management module fully implemented.

---

## PHASE 6 — Performance

### Task ID: T-011
**Title:** Database Indexing & Query Optimization
**Priority:** Medium
**Status:** Not Started
**Estimated Hours:** 4
**Dependencies:** None
**Affected Modules:** Backend, Database
**Frontend Files:** N/A
**Backend Files:** N/A
**Database Changes:** Add indexes
**API Changes:** None
**Risk Level:** Medium
**Testing Required:** Performance Test
**Acceptance Criteria:** Database queries are optimized.

---

## PHASE 7 — Security

### Task ID: T-012
**Title:** Harden CORS Policy
**Priority:** High
**Status:** Not Started
**Estimated Hours:** 1
**Dependencies:** None
**Affected Modules:** Backend
**Frontend Files:** N/A
**Backend Files:** `backend/LocalMindAI.Api/Program.cs`
**Database Changes:** None
**API Changes:** None
**Risk Level:** Low
**Testing Required:** Manual Security
**Acceptance Criteria:** CORS restricted to approved origins.

### Task ID: T-013
**Title:** Enforce Environment-Based JWT Secrets
**Priority:** High
**Status:** Not Started
**Estimated Hours:** 1
**Dependencies:** None
**Affected Modules:** Backend
**Frontend Files:** N/A
**Backend Files:** `appsettings.Development.json` / Environment
**Database Changes:** None
**API Changes:** None
**Risk Level:** Medium
**Testing Required:** Security Audit
**Acceptance Criteria:** JWT secrets are not hardcoded.

---

## PHASE 8 — Production Deployment

### Task ID: T-014
**Title:** Final Production Readiness Configuration
**Priority:** Medium
**Status:** Not Started
**Estimated Hours:** 4
**Dependencies:** T-013
**Affected Modules:** Backend, Frontend
**Frontend Files:** `frontend/vite.config.js`
**Backend Files:** `backend/LocalMindAI.Api/appsettings.json`
**Database Changes:** None
**API Changes:** None
**Risk Level:** High
**Testing Required:** E2E Test
**Acceptance Criteria:** Application is deployable to production environment.

---

# Current Sprint

1. T-001: Map Review Model to ApplicationDbContext
2. T-002: Run Initial Migrations for Review Entity
3. T-003: Implement ReviewsController
4. T-004: Implement ReviewService Business Logic
5. T-005: Implement Global Error Handling Middleware
6. T-006: Connect Reviews Page to Backend
7. T-007: Connect AI Replies Page to Backend
8. T-008: Robust AI Service Implementation
9. T-009: Implement AI Request Caching
10. T-010: Implement Leave Management Module

# Future Sprint

11. T-011: Database Indexing & Query Optimization
12. T-012: Harden CORS Policy
13. T-013: Enforce Environment-Based JWT Secrets
14. T-014: Final Production Readiness Configuration
