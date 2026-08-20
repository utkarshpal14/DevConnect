# DevConnect

Coding Standards Document

Version: 1.0

Status: Standards Freeze

---

# 1. Purpose

This document defines:

- Coding conventions
- Naming conventions
- API response standards
- Validation standards
- Error handling standards
- Logging standards
- Documentation standards
- AI Agent coding rules

All contributors must follow these standards.

---

# 2. General Principles

Code should be:

- Readable
- Maintainable
- Scalable
- Modular
- Reusable

Priority Order:

Correctness
↓
Security
↓
Maintainability
↓
Performance

---

# 3. Clean Code Rules

Always:

- Use meaningful names
- Write small functions
- Write reusable code
- Follow module boundaries

Avoid:

- Magic numbers
- Hardcoded values
- Duplicate code
- Deep nesting

---

Bad

const x = 1;

Good

const DEFAULT_PAGE_SIZE = 10;

---

# 4. File Naming Convention

Controllers

auth.controller.js

jobs.controller.js

applications.controller.js

---

Services

auth.service.js

jobs.service.js

---

Repositories

auth.repository.js

jobs.repository.js

---

Validators

auth.validator.js

jobs.validator.js

---

Routes

auth.routes.js

jobs.routes.js

---

# 5. Variable Naming Rules

Use camelCase

Good

const userId

const matchScore

const applicationStatus

---

Bad

const UserID

const user_id

const USERID

---

# 6. Function Naming Rules

Use verb-based names

Examples

createUser()

loginUser()

getJobById()

updateApplicationStatus()

calculateMatchScore()

---

Avoid

doStuff()

handleData()

processThing()

---

# 7. Model Naming Rules

Use PascalCase

Examples

User

StudentProfile

RecruiterProfile

Job

Application

Notification

---

# 8. Route Naming Rules

Use kebab-case

Good

/api/v1/jobs

/api/v1/skill-gap

/api/v1/applications

---

Bad

/api/v1/GetJobs

/api/v1/getJobs

/api/v1/jobApplications

---

# 9. Controller Rules

Controllers are responsible for:

- Request handling
- Calling services
- Sending responses

Controllers must NOT:

- Query database directly
- Contain business logic

---

Good

Controller
↓
Service
↓
Repository
↓
Database

---

# 10. Service Rules

Services contain:

- Business Logic
- Calculations
- Workflow Logic

Services must NOT:

- Return HTTP responses
- Access req/res objects

---

# 11. Repository Rules

Repositories contain:

- Database Queries

Repositories must NOT:

- Perform calculations
- Validate requests

---

# 12. Validation Rules

All request validation must happen before service execution.

Use:

express-validator

or

Joi

---

Validate:

Email

Password

IDs

Query Parameters

Body Data

---

Never trust client input.

---

# 13. Error Handling Rules

Every API must use centralized error handling.

---

Error Example

{
  "success": false,
  "message": "Invalid credentials"
}

---

Do NOT expose:

- Stack traces
- Database errors
- Internal implementation details

---

Bad

{
  "error": "MongoServerError..."
}

---

# 14. Success Response Rules

All APIs return:

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

---

Consistency is mandatory.

---

# 15. HTTP Status Codes

200

Success

---

201

Created

---

400

Bad Request

---

401

Unauthorized

---

403

Forbidden

---

404

Not Found

---

409

Conflict

---

500

Internal Server Error

---

# 16. Authentication Rules

Passwords must:

- Be hashed
- Never be stored as plain text

Use:

bcrypt

---

JWT Secret

Must come from:

.env

Never hardcode secrets.

---

# 17. Environment Variable Rules

Store in .env

Examples

PORT

MONGO_URI

JWT_SECRET

REDIS_URL

AI_SERVICE_URL

---

Never commit:

.env

---

# 18. Database Rules

Use Mongoose Models only.

Do NOT write raw MongoDB logic throughout the codebase.

---

Always use indexes where defined.

---

Follow:

02_DATABASE_DESIGN.md

---

# 19. Logging Rules

Development

console.log()

Allowed

---

Production

Use logger utility

Examples

info()

warn()

error()

---

Never log:

Passwords

JWT Tokens

Sensitive Data

---

# 20. API Documentation Rules

Every endpoint must include:

Purpose

Request

Response

Authorization

Possible Errors

---

Swagger documentation required.

---

# 21. Git Commit Standards

Format

type: short description

---

Examples

feat: add login api

fix: resolve jwt validation bug

docs: update database design

refactor: optimize job service

test: add auth tests

---

Allowed Types

feat

fix

docs

refactor

test

chore

---

# 22. Pull Request Standards

PR Title

[module] short description

Example

[Auth] Add Login API

---

PR Must Include

Purpose

Files Changed

Testing Evidence

Screenshots (if UI)

---

# 23. AI Service Standards

FastAPI Routes

Must remain thin.

---

Business Logic

Must remain inside services.

---

Response Format

{
  "success": true,
  "data": {}
}

---

Follow same conventions as backend.

---

# 24. Frontend Standards

Components should be:

Reusable

Small

Focused

---

One Component

One Responsibility

---

Avoid:

1000-line components

---

# 25. Security Standards

Always:

Validate Inputs

Hash Passwords

Use JWT

Sanitize Data

Check Authorization

---

Never:

Trust User Input

Store Plain Passwords

Expose Internal Errors

---

# 26. Testing Standards

Every module should have:

Happy Path Test

Validation Test

Error Test

Authorization Test

---

Critical APIs require testing before merge.

---

# 27. Documentation Standards

Whenever a major change occurs:

Update Documentation First

Then Code

---

Documents take priority over implementation.

---

# 28. AI Agent Rules

Before coding:

Read

00_PROJECT_OVERVIEW.md

01_SYSTEM_ARCHITECTURE.md

02_DATABASE_DESIGN.md

03_API_CONTRACTS.md

07_TEAM_OWNERSHIP.md

---

Agents may NOT:

Modify Schemas

Modify APIs

Modify Ownership Rules

Modify Folder Structure

Without Approval

---

Agents may only edit:

Assigned Module Files

---

# 29. Code Review Checklist

Before Merge

✓ Follows Architecture

✓ Follows Database Design

✓ Follows API Contracts

✓ Follows Folder Structure

✓ Follows Ownership Rules

✓ Tested

✓ Documented

---

# 30. Status

Status: APPROVED

Version: 1.0

Standards State: FROZEN