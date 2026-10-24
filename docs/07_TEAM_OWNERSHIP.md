# DevConnect

Team Ownership Document

Version: 1.0

Status: Team Structure Freeze

---

# 1. Ownership Rules

Ownership is path-based. A member may modify only the paths assigned below. Shared paths require coordination with the affected owner. `docs/02_DATABASE_DESIGN.md` and `docs/03_API_CONTRACTS.md` remain frozen contracts.

# 2. Member 1 - Authentication & Student Module

```text
backend/src/controllers/auth*
backend/src/routes/auth*
backend/src/middleware/*
backend/src/middlewares/*
backend/src/models/User*
backend/src/models/StudentProfile*
backend/src/modules/auth/*
frontend/src/pages/auth/*
```

Responsibilities: user model, registration, login, JWT, role authorization, and student profiles.

Branch: `feature/auth`

# 3. Member 2 - Recruitment Module

```text
backend/src/models/Recruiter*
backend/src/models/Job*
backend/src/models/Application*
backend/src/controllers/recruitment*
backend/src/routes/recruitment*
frontend/src/pages/student/Profile*
frontend/src/pages/student/Dashboard*
frontend/src/components/profile/*
```

Responsibilities: recruiter profiles, jobs, applications, search, filtering, and pagination.

Branch: `feature/recruitment`

# 4. Member 3 - AI Module

```text
ai-service/*
backend/src/routes/ai*
backend/src/controllers/ai*
frontend/src/pages/recruiter/*
frontend/src/pages/common/Jobs*
frontend/src/components/jobs/*
```

Responsibilities: resume parsing, candidate matching, and skill-gap analysis.

Branch: `feature/ai`

# 5. Member 4 - Admin + DevOps

```text
docker/*
.github/*
docs/*
backend/src/config/*
backend/src/utils/*
backend/src/constants/*
backend/src/sockets/*
backend/src/cache/*
backend/src/controllers/admin*
backend/src/routes/admin*
backend/src/controllers/notification*
backend/src/routes/notification*
frontend/src/pages/student/Applications*
frontend/src/components/applications/*
```

Responsibilities: admin, notifications, Socket.IO, Redis, Swagger, Docker, deployment, and documentation.

Branch: `feature/admin-devops`

# 6. Completed Foundation & Frontend Slices

The initial project foundation and Frontend Design Phase are completed and merged:
- **Member 1 (`feature/auth`):** Backend Authentication (Milestone 1) & Student Portfolio (Milestone 2) + Milestone 1 Authentication UI
- **Member 2 (`feature/recruitment`):** Backend Recruiter & Jobs (Milestone 3) & Application Pipeline (Milestone 4) + Milestone 2 Student Portfolio UI
- **Member 3 (`feature/ai`):** Milestone 3 Recruiter & Jobs UI
- **Member 4 (`feature/admin-devops`):** Milestone 4 Applications UI & Recruiter Review

---

# 7. Sequential Milestone Ownership for Remaining Work (Weeks 7–10)

Each subsequent milestone is owned and executed sequentially by one team member, followed by unified deployment and academic submission:

### Milestone 5 — Member 1 (`feature/auth`)
**AI Skill Gap Analyzer & Student Career Intelligence**
- Paths:
  - `backend/src/routes/ai.routes.js` (Skill gap endpoints)
  - `ai-service/app/services/skill_gap_service.py`
  - `ai-service/app/api/skill_gap.py`
  - `frontend/src/pages/student/CareerAdvice*`
  - `tests/skillgap.test.js`
- Responsibilities: Role taxonomy matching, missing skills detection, prioritized learning recommendations, Student Career Advice UI, and Vercel frontend deployment.

### Milestone 6 — Member 2 (`feature/recruitment`)
**AI Candidate Match Scoring Engine & Recruiter Review**
- Paths:
  - `backend/src/routes/ai.routes.js` (Candidate matching endpoints)
  - `backend/src/models/AIMatchResult.js`
  - `ai-service/app/services/candidate_matching_service.py`
  - `ai-service/app/api/candidate_matcher.py`
  - `frontend/src/components/jobs/CandidateMatchModal*`
  - `tests/matching.test.js`
- Responsibilities: Candidate match percentage calculation, skill comparison against job requirements, `ai_match_results` persistence, Recruiter Match Breakdown Drawer, and cloud smoke testing.

### Milestone 7 — Member 3 (`feature/ai`)
**Core FastAPI AI Microservice, Resume Parser & Redis Caching**
- Paths:
  - `ai-service/app/main.py`
  - `ai-service/app/services/resume_parser_service.py`
  - `ai-service/app/api/resume_parser.py`
  - `backend/src/config/redis.js`
  - `backend/src/cache/*`
  - `frontend/src/components/profile/ResumeUploadModal*`
  - `docker/ai-service/*`
- Responsibilities: FastAPI application setup, PDF resume parsing with `pdfplumber`/`PyPDF2`, skills dictionary normalization, resume upload auto-population UI, Redis Cloud caching layer for high-speed queries, and AI Pytest suite.

### Milestone 8 — Member 4 (`feature/admin-devops`)
**Realtime Notifications, Admin Dashboard & Multi-Container Dockerization**
- Paths:
  - `backend/src/sockets/*` (Socket.IO realtime server & events)
  - `backend/src/models/Notification.js` & `backend/src/models/AuditLog.js`
  - `backend/src/controllers/admin*` & `backend/src/routes/admin*`
  - `backend/src/controllers/notification*` & `backend/src/routes/notification*`
  - `frontend/src/pages/admin/*`
  - `frontend/src/components/notifications/NotificationBell*`
  - `docker/*` (`docker-compose.yml`, backend/frontend Dockerfiles)
- Responsibilities: Socket.IO realtime communication, notification model & APIs, live notification bell, Admin Dashboard UI & APIs, system audit logging, Docker multi-container environment, and Render backend deployment.

### Milestone 9 — All Members (`main`)
**Cloud Deployment, Swagger Documentation & Final Academic Submission**
- Responsibilities:
  - Member 1: Vercel frontend deployment, Auth/Student Swagger documentation, Final Report chapters & Viva defense
  - Member 2: Cloud smoke testing, Recruitment Swagger documentation, Final Report chapters & Live Demo
  - Member 3: Render AI service deployment, AI Swagger documentation, Final Report chapters & Live Demo
  - Member 4: Render backend deployment, Atlas & Redis Cloud setup, Swagger UI Lead (`/api/docs`), Demonstration Video Walkthrough & Final Report chapters
- Overall Contribution: Exactly 25% each across the complete project lifecycle.

---

# 8. Shared Paths & Coordination Rules

```text
frontend/src/components/*
frontend/src/services/*
frontend/src/routes/*
backend/src/services/*
backend/src/repositories/*
backend/src/validators/*
docs/02_DATABASE_DESIGN.md
docs/03_API_CONTRACTS.md
```

Rules:
1. Changes to shared paths require prior coordination with affected members.
2. The frozen API contracts (`docs/03_API_CONTRACTS.md`) and database schema (`docs/02_DATABASE_DESIGN.md`) must be strictly maintained.
3. Every feature slice enters `develop` exclusively through an approved pull request with passing automated tests.

---

# 9. Status

Status: APPROVED

Version: 1.2

Ownership State: FROZEN

