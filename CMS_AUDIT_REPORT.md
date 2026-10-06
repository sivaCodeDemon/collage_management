# College Management System — Full Audit Report

## ✅ Overall Status

| Layer | Status |
|---|---|
| Backend compile | BUILD SUCCESS |
| Backend unit tests (8 tests) | ALL PASS |
| Frontend build | BUILD SUCCESS (1,273 kB bundle) |
| Flyway migrations (V1-V11) | All 11 applied cleanly |
| Health endpoint (/actuator/health) | UP |
| Login API | Working (Admin@123) |
| Students, Professors, Departments, Courses | Working |
| Notices, Leaves endpoints | No backend controller — falls back to mock |

---

## Bugs Found and Fixed

### Bug 1 - Wrong BCrypt Password Hash in Seed Data (CRITICAL)
File: backend/src/main/resources/db/migration/V11__seed_data.sql

All 8 seeded users had an invalid BCrypt hash that matched NO password.
Fixed: Replaced with correct hash for Admin@123 in all 8 user INSERT statements.
Old: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFNGBmkPW3.KPGK
New: $2a$12$hNU7m8Wq5QPX0SAc5S0mwOVffWwckCqNI24STHuw7ZKEb3f4IMVlu

### Bug 2 - Wrong Default DB Password in application.yml (HIGH)
Fixed: password: ${DATABASE_PASSWORD:${POSTGRES_PASSWORD:root}}

### Bug 3 - Mail Health Check Causing /actuator/health to Return 503 (MEDIUM)
Added: management.health.mail.enabled: false in application.yml

### Bug 4 - .env Had Production Password That Doesnt Match Local DB (LOW)
Updated: POSTGRES_PASSWORD=root and DATABASE_PASSWORD=root

### Gap - Missing Backend Controllers for Notices and Leave
GET /api/v1/notices and GET /api/v1/leaves return 500.
Frontend gracefully falls back to mock data so UI still works.

---

## Login Credentials (password for all: Admin@123)

| Email | Role |
|---|---|
| superadmin@college.edu | SUPER_ADMIN |
| principal@college.edu | PRINCIPAL |
| admin@college.edu | ADMIN |
| professor@college.edu | PROFESSOR |
| student@college.edu | STUDENT |
| accountant@college.edu | ACCOUNTANT |
| librarian@college.edu | LIBRARIAN |
| hod@college.edu | HOD |

---

## How to Run

Backend:
  cd backend
  $env:DATABASE_PASSWORD="root"
  mvn spring-boot:run
  # http://localhost:8080  |  Swagger: http://localhost:8080/swagger-ui.html

Frontend:
  cd frontend
  npm run dev
  # http://localhost:5173

