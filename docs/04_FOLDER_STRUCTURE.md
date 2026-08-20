# DevConnect

Folder Structure Document

Version: 1.0

Status: Structure Freeze

---

# 1. Purpose

This document defines the official folder structure of DevConnect.

All developers and AI agents must follow this structure.

No new top-level folders may be added without team approval.

---

# 2. Repository Structure

DevConnect/

├── frontend/
├── backend/
├── ai-service/
├── docker/
├── docs/
├── .github/
├── README.md
├── .gitignore

---

# 3. Frontend Structure

frontend/

├── public/
│
├── src/
│
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   ├── layouts/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── context/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   ├── types/
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   │
│   └── main.jsx
│
├── package.json
│
└── vite.config.js

---

# 4. Frontend Pages Structure

pages/

├── auth/
│   ├── Login.jsx
│   └── Register.jsx
│
├── student/
│   ├── Dashboard.jsx
│   ├── Profile.jsx
│   ├── Applications.jsx
│   └── SkillGap.jsx
│
├── recruiter/
│   ├── Dashboard.jsx
│   ├── Jobs.jsx
│   ├── Applicants.jsx
│   └── MatchResults.jsx
│
├── admin/
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   └── Analytics.jsx
│
└── common/
    ├── Home.jsx
    ├── Jobs.jsx
    └── NotFound.jsx

---

# 5. Backend Structure

backend/

├── src/
│
│   ├── config/
│   │
│   ├── controllers/
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── models/
│   │
│   ├── routes/
│   │
│   ├── middlewares/
│   │
│   ├── validators/
│   │
│   ├── sockets/
│   │
│   ├── cache/
│   │
│   ├── utils/
│   │
│   ├── constants/
│   │
│   ├── modules/
│   │
│   ├── app.js
│   │
│   └── server.js
│
├── tests/
│
├── package.json
│
└── .env

---

# 6. Backend Module Structure

Each module follows the same pattern.

Example:

modules/auth/

├── auth.controller.js
├── auth.service.js
├── auth.repository.js
├── auth.routes.js
├── auth.validator.js

---

modules/jobs/

├── jobs.controller.js
├── jobs.service.js
├── jobs.repository.js
├── jobs.routes.js
├── jobs.validator.js

---

modules/applications/

├── applications.controller.js
├── applications.service.js
├── applications.repository.js
├── applications.routes.js
├── applications.validator.js

---

# 7. Backend Module List

modules/

├── auth/
│
├── users/
│
├── students/
│
├── recruiters/
│
├── jobs/
│
├── applications/
│
├── notifications/
│
├── admin/
│
├── analytics/
│
└── integrations/

---

# 8. Model Structure

models/

├── User.js
├── StudentProfile.js
├── RecruiterProfile.js
├── Job.js
├── Application.js
├── Notification.js
├── AIMatchResult.js
└── AuditLog.js

---

# 9. Route Structure

routes/

├── auth.routes.js
├── student.routes.js
├── recruiter.routes.js
├── jobs.routes.js
├── applications.routes.js
├── notifications.routes.js
├── admin.routes.js
└── ai.routes.js

---

# 10. AI Service Structure

ai-service/

├── app/
│
│   ├── api/
│   │
│   ├── services/
│   │
│   ├── models/
│   │
│   ├── utils/
│   │
│   ├── core/
│   │
│   └── main.py
│
├── tests/
│
├── requirements.txt
│
└── .env

---

# 11. AI API Structure

api/

├── resume_parser.py
├── candidate_matcher.py
└── skill_gap.py

---

# 12. AI Service Layer

services/

├── resume_parser_service.py
├── candidate_matching_service.py
└── skill_gap_service.py

---

# 13. Docker Structure

docker/

├── backend/
│   └── Dockerfile
│
├── frontend/
│   └── Dockerfile
│
├── ai-service/
│   └── Dockerfile
│
└── docker-compose.yml

---

# 14. Documentation Structure

docs/

├── 00_PROJECT_OVERVIEW.md
├── 01_SYSTEM_ARCHITECTURE.md
├── 02_DATABASE_DESIGN.md
├── 03_API_CONTRACTS.md
├── 04_FOLDER_STRUCTURE.md
├── 05_CODING_STANDARDS.md
├── 06_GIT_WORKFLOW.md
├── 07_TEAM_OWNERSHIP.md
├── 08_AI_SERVICE_SPEC.md
├── 09_DEVELOPMENT_ROADMAP.md
├── 10_AGENT_RULES.md
├── 11_DEPLOYMENT_PLAN.md
├── 12_TESTING_STRATEGY.md

---

# 15. Ownership Mapping

Member 1

Owns

modules/auth
modules/users
middlewares

---

Member 2

Owns

modules/recruiters
modules/jobs
modules/applications

---

Member 3

Owns

ai-service/

---

Member 4

Owns

modules/admin
modules/notifications
cache
sockets
docker

---

# 16. Layer Responsibilities

Controller

Responsibilities

- Receive Request
- Return Response

Must NOT

- Access Database Directly

---

Service

Responsibilities

- Business Logic

Must NOT

- Return HTTP Responses

---

Repository

Responsibilities

- Database Operations

Must NOT

- Contain Business Logic

---

Validator

Responsibilities

- Request Validation

Must NOT

- Query Database

---

Model

Responsibilities

- Schema Definition

Must NOT

- Contain Business Logic

---

# 17. Naming Conventions

Files

camelCase

Example

authController.js

jobService.js

---

Models

PascalCase

Example

User.js

Job.js

Application.js

---

Routes

kebab-case URLs

Example

/api/v1/jobs

/api/v1/applications

/api/v1/skill-gap

---

# 18. Forbidden Structure Changes

AI Agents and Developers may NOT:

- Create random folders
- Move modules
- Rename modules
- Create duplicate services
- Change ownership mapping

without approval.

---

# 19. Folder Structure Status

Status: APPROVED

Version: 1.0

Structure State: FROZEN