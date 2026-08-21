# DevConnect

Folder Structure Document

Version: 1.0

Status: Structure Freeze

---

# 1. Purpose

This document defines the final repository structure. Developers and AI agents must follow it. New top-level folders, renamed modules, and moved modules require team approval.

# 2. Repository Structure

```text
DevConnect/
├── frontend/
├── backend/
├── ai-service/
├── docker/
├── docs/
├── .github/
├── .gitignore
├── README.md
└── LICENSE
```

# 3. Frontend Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

# 4. Backend Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── sockets/
│   ├── cache/
│   ├── utils/
│   ├── constants/
│   ├── app.js
│   └── server.js
├── tests/
├── package.json
└── .env.example
```

# 5. AI Service Structure

```text
ai-service/
├── app/
│   ├── api/
│   ├── services/
│   ├── models/
│   ├── utils/
│   ├── prompts/
│   └── main.py
├── tests/
├── requirements.txt
└── .env.example
```

# 6. Docker and GitHub Structure

```text
docker/
├── backend/Dockerfile
├── frontend/Dockerfile
├── ai-service/Dockerfile
└── docker-compose.yml

.github/
├── ISSUE_TEMPLATE/
└── PULL_REQUEST_TEMPLATE.md
```

# 7. Backend Layer Responsibilities

- Controllers receive requests and return responses.
- Services contain business and workflow logic.
- Repositories contain database operations.
- Models define the approved Mongoose schemas.
- Validators validate requests before services execute.
- Routes register HTTP endpoints.
- Middleware handles authentication, authorization, and shared request concerns.

# 8. Model Names

```text
User.js
StudentProfile.js
RecruiterProfile.js
Job.js
Application.js
Notification.js
AIMatchResult.js
AuditLog.js
```

Model names and fields remain governed by `docs/02_DATABASE_DESIGN.md`. A separate `Company` model is not introduced without schema approval.

# 9. Naming Conventions

- JavaScript files use camelCase or the established layer suffix format, such as `auth.controller.js`.
- Mongoose models use PascalCase.
- API URLs use kebab-case under `/api/v1`.
- Python modules use snake_case.

# 10. Status

Status: APPROVED

Version: 1.0

Structure State: FROZEN
