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

# 6. Frontend Design Ownership by Completed Milestone

Frontend design is delivered after backend Milestone 4 and is divided by the
corresponding completed backend milestone. This frontend phase is the current
work; later backend milestones are extended until this phase is complete.

| Frontend slice | Owner | Branch |
|---|---|---|
| Milestone 1 authentication UI | Member 1 | `feature/auth` |
| Milestone 2 student portfolio UI | Member 2 | `feature/recruitment` |
| Milestone 3 recruiter and jobs UI | Member 3 | `feature/ai` |
| Milestone 4 applications UI | Member 4 | `feature/admin-devops` |

Each owner must keep frontend changes within the paths assigned above. The
backend milestone owner reviews the corresponding UI PR before integration.
Member 4 may also use `frontend/src/pages/admin/*` later for the Admin UI;
that path is not part of the current Milestone 4 applications slice.

# 7. Shared Paths

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

Changes to shared paths require coordination and must preserve the frozen API and database contracts.

# 8. Git Workflow

Protected branches are `main` and `develop`. Work occurs on feature branches, then moves through pull request review, `develop`, testing, and `main`. Direct pushes and self-merges are prohibited.

# 9. Status

Status: APPROVED

Version: 1.0

Ownership State: FROZEN
