# ?? College Management System (CMS)

A production-ready, enterprise-grade College Management System built with **Spring Boot** (backend) and **React + TypeScript** (frontend).

---

## ?? Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start with Docker Compose](#quick-start-with-docker-compose)
  - [Manual Setup (Development)](#manual-setup-development)
- [Default Login Credentials](#-default-login-credentials)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Architecture Overview](#-architecture-overview)
- [Screenshots](#-screenshots)

---

## ? Features

### Academic Management
- **Student Management** – Enroll, profile, search, export, multi-tab view (academic, fees, attendance)
- **Professor Management** – Faculty profiles, designation, department assignment
- **Department Management** – Departmental hierarchy, HOD assignment
- **Course & Subjects** – Course catalogue, credit hours, enrollment management

### Operations
- **Attendance Tracking** – Daily attendance per class/course, percentage tracking
- **Examination & Grades** – Exam schedules, result entry, grade publication
- **Timetable** – Visual weekly timetable grid per class/semester
- **Assignments** – Create, submit, and grade assignments

### Finance & Library
- **Fee Management** – Fee structure, payment recording, outstanding dues, receipts
- **Library System** – Book catalogue, issue/return tracking, fine management

### Communication
- **Notice Board** – Priority notices with category filters (ACADEMIC, EXAM, GENERAL, etc.)
- **Leave Management** – Student/staff leave requests with approval workflow
- **Notifications** – Real-time in-app notifications

### Administration
- **Role-Based Access Control (RBAC)** – SUPER_ADMIN, PRINCIPAL, HOD, PROFESSOR, STUDENT roles
- **Audit Logs** – Full audit trail of all sensitive operations
- **Reports & Analytics** – Charts for enrollment, attendance, revenue trends
- **User Profile** – Account settings, password change, theme toggle

---

## ?? Technology Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Runtime |
| Spring Boot | 3.2.5 | Framework |
| Spring Security + JWT | 6.x | Authentication & RBAC |
| Spring Data JPA | 3.x | ORM |
| PostgreSQL | 16 | Primary database |
| Flyway | 9.x | Database migrations |
| MapStruct | 1.5.5 | DTO mapping |
| Lombok | 1.18 | Boilerplate reduction |
| SpringDoc / Swagger UI | 2.3 | API documentation |
| Spring Mail | 3.x | Email notifications |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 8 | Build tool |
| Material UI (MUI) | 5 | Component library |
| Redux Toolkit | 2 | Global state |
| React Router | 6 | Client routing |
| Axios | 1.x | HTTP client |
| React Query | 5 | Server state |
| React Hook Form | 7 | Forms |
| Recharts | 2 | Data visualisation |
| React Hot Toast | 2 | Notifications |

### Infrastructure
| Technology | Purpose |
|---|---|
| Docker | Containerisation |
| Docker Compose | Local orchestration |
| Nginx | Frontend web server / reverse proxy |

---

## ?? Getting Started

### Prerequisites

- **Docker Desktop** = 24 (recommended for quick start)
- **OR** Java 17+, Node.js 20+, PostgreSQL 16+

### Quick Start with Docker Compose

```bash
# 1. Clone the repo
git clone <repo-url>
cd collage_management

# 2. Copy environment file and configure if needed
cp .env.example .env

# 3. Start all services
docker compose up --build -d

# 4. Open the app
# Frontend:  http://localhost
# Backend:   http://localhost:8080
# Swagger:   http://localhost:8080/swagger-ui.html

# (Optional) Start with pgAdmin DB GUI
docker compose --profile tools up -d
# pgAdmin: http://localhost:5050
```

### Manual Setup (Development)

#### Backend

```bash
cd backend

# Ensure PostgreSQL is running locally and create the database
psql -U postgres -c "CREATE DATABASE college_db;"

# Run the backend
./mvnw spring-boot:run
# Server starts on http://localhost:8080
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
# Opens on http://localhost:5173
```

---

## ?? Default Login Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@college.edu | Admin@123 |
| Principal | principal@college.edu | Admin@123 |
| HOD / Professor | hod.cse@college.edu | Admin@123 |
| Professor | prof.vikram@college.edu | Admin@123 |
| Student | student@college.edu | Admin@123 |

> ?? Change all default passwords before deploying to production.

---

## ?? Project Structure

```
collage_management/
+-- backend/                        # Spring Boot application
¦   +-- src/main/java/com/college/cms/
¦   ¦   +-- auth/                   # JWT auth, login, refresh
¦   ¦   +-- student/                # Student entity, service, controller
¦   ¦   +-- professor/              # Professor management
¦   ¦   +-- department/             # Departments
¦   ¦   +-- course/                 # Courses & subjects
¦   ¦   +-- attendance/             # Attendance tracking
¦   ¦   +-- examination/            # Exams & results
¦   ¦   +-- fee/                    # Fee management & payments
¦   ¦   +-- library/                # Library management
¦   ¦   +-- leave/                  # Leave requests & approvals
¦   ¦   +-- notice/                 # Notices & announcements
¦   ¦   +-- timetable/              # Timetable scheduling
¦   ¦   +-- report/                 # Report generation
¦   ¦   +-- security/               # JWT filters, RBAC
¦   ¦   +-- common/                 # Shared DTOs, exceptions, audit
¦   +-- src/main/resources/
¦       +-- application.yml
¦       +-- db/migration/           # Flyway SQL migrations (V1–V11)
¦
+-- frontend/                       # React + TypeScript application
¦   +-- src/
¦       +-- features/               # Feature-based modules
¦       ¦   +-- auth/               # Login page
¦       ¦   +-- dashboard/          # Dashboard with analytics
¦       ¦   +-- students/           # Student CRUD & profiles
¦       ¦   +-- professors/         # Professor management
¦       ¦   +-- departments/        # Departments
¦       ¦   +-- courses/            # Course catalogue
¦       ¦   +-- attendance/         # Attendance views
¦       ¦   +-- examinations/       # Exam schedules & results
¦       ¦   +-- fees/               # Fee tracking
¦       ¦   +-- library/            # Library books & issues
¦       ¦   +-- leave/              # Leave management
¦       ¦   +-- timetable/          # Timetable grid
¦       ¦   +-- notices/            # Notice board
¦       ¦   +-- reports/            # Analytics & reports
¦       ¦   +-- users/              # Audit logs
¦       +-- services/               # API service layer + mock data
¦       +-- store/                  # Redux store, slices
¦       +-- types/                  # TypeScript interfaces
¦       +-- components/             # Shared UI components
¦       +-- routes/                 # App routing & protected routes
¦
+-- docker-compose.yml              # Full-stack orchestration
+-- .env.example                    # Environment variable template
+-- README.md                       # This file
```

---

## ?? API Documentation

Swagger UI is available when the backend is running:

- **Development:** http://localhost:8080/swagger-ui.html
- **API Docs JSON:** http://localhost:8080/api-docs

---

## ?? Environment Variables

Copy `.env.example` to `.env` and customise:

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_USER` | postgres | Database user |
| `POSTGRES_PASSWORD` | postgres | Database password |
| `JWT_SECRET` | (hex string) | Secret for signing JWTs (change in prod!) |
| `MAIL_HOST` | smtp.gmail.com | SMTP server |
| `MAIL_PORT` | 587 | SMTP port |
| `MAIL_USERNAME` | noreply@college.edu | From email address |
| `MAIL_PASSWORD` | changeme | SMTP password |
| `PGADMIN_EMAIL` | admin@college.edu | pgAdmin login |
| `PGADMIN_PASSWORD` | admin | pgAdmin password |

---

## ?? Architecture Overview

```
Browser
  ¦
  ?
+-----------------+    HTTP /api/*    +----------------------+
¦  Nginx (port 80)¦ ----------------? ¦  Spring Boot (8080)  ¦
¦  React SPA      ¦                   ¦  REST API + Security ¦
+-----------------+                   +----------------------+
                                                 ¦ JPA / JDBC
                                      +----------?-----------+
                                      ¦  PostgreSQL (5432)   ¦
                                      ¦  + Flyway Migrations ¦
                                      +----------------------+
```

- **Frontend** is served as a static SPA via Nginx.
- **API calls** (`/api/*`) are proxied from Nginx to the Spring Boot container.
- **Spring Security** validates JWT tokens on every protected endpoint.
- **Flyway** runs database migrations automatically on startup (V1–V11).

---

## ?? Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## ?? License

MIT License — see [LICENSE](LICENSE) for details.
