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
backend/src/models/User*
backend/src/models/StudentProfile*
frontend/src/pages/auth/*
frontend/src/pages/student/*
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
frontend/src/pages/recruiter/*
frontend/src/components/jobs/*
```

Responsibilities: recruiter profiles, jobs, applications, search, filtering, and pagination.

Branch: `feature/recruitment`

# 4. Member 3 - AI Module

```text
ai-service/*
backend/src/routes/ai*
backend/src/controllers/ai*
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
frontend/src/pages/admin/*
```

Responsibilities: admin, notifications, Socket.IO, Redis, Swagger, Docker, deployment, and documentation.

Branch: `feature/admin-devops`

# 6. Shared Paths

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

# 7. Git Workflow

Protected branches are `main` and `develop`. Work occurs on feature branches, then moves through pull request review, `develop`, testing, and `main`. Direct pushes and self-merges are prohibited.

# 8. Status

Status: APPROVED

Version: 1.0

Ownership State: FROZEN
