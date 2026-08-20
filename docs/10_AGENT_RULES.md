# DevConnect

AI Agent Rules & Governance Document

Version: 1.0

Status: Mandatory

Applies To:

- ChatGPT
- Claude
- Claude Code
- Cursor Agent
- GitHub Copilot
- Continue
- Roo Code
- Cline
- OpenHands
- Any Future Coding Agent

---

# 1. Purpose

This document defines:

- AI Agent Permissions
- Protected Files
- Modification Rules
- Development Workflow
- Conflict Prevention Strategy

Every AI agent must follow these rules.

Failure to follow these rules may break architecture consistency and create merge conflicts.

---

# 2. Mandatory Reading Order

Before performing ANY task, every AI agent must read:

1. docs/00_PROJECT_OVERVIEW.md

2. docs/01_SYSTEM_ARCHITECTURE.md

3. docs/02_DATABASE_DESIGN.md

4. docs/03_API_CONTRACTS.md

5. docs/04_FOLDER_STRUCTURE.md

6. docs/07_TEAM_OWNERSHIP.md

7. docs/09_DEVELOPMENT_ROADMAP.md

8. docs/10_AGENT_RULES.md

---

If any document is missing:

STOP

Request clarification.

Do not make assumptions.

---

# 3. Architecture Protection Rules

Agents may NOT:

- Change architecture
- Introduce new services
- Introduce new databases
- Change service communication flow
- Modify deployment strategy

Without team approval.

---

Forbidden Examples

❌ Add PostgreSQL

❌ Replace MongoDB

❌ Replace Express

❌ Direct Frontend → Database Connection

❌ Direct AI Service → Database Connection

---

# 4. Database Protection Rules

Database schema is frozen.

Reference:

docs/02_DATABASE_DESIGN.md

---

Agents may NOT:

- Rename fields
- Remove fields
- Change data types
- Modify relationships
- Create duplicate collections

Without approval.

---

Example

Forbidden

Change

email

to

emailAddress

---

Forbidden

Change

skills: [String]

to

skills: Object

---

# 5. API Protection Rules

Reference:

docs/03_API_CONTRACTS.md

---

Agents may NOT:

- Rename endpoints
- Change HTTP methods
- Change request structures
- Change response structures

Without approval.

---

Example

Forbidden

POST /api/v1/jobs

↓

POST /api/jobs/create

---

Forbidden

Change

{
 "jobId":""
}

to

{
 "id":""
}

---

# 6. Folder Structure Protection Rules

Reference:

docs/04_FOLDER_STRUCTURE.md

---

Agents may NOT:

- Create random folders
- Rename modules
- Move modules
- Duplicate modules

Without approval.

---

Forbidden

Create

backend/src/myFolder/

---

Allowed

Modify existing module structure.

---

# 7. Team Ownership Rules

Reference:

docs/07_TEAM_OWNERSHIP.md

---

Agents must respect module ownership.

---

Member 1 Agent

Allowed

auth

users

middleware

Denied

jobs

applications

admin

ai-service

---

Member 2 Agent

Allowed

jobs

applications

recruiters

Denied

auth

admin

ai-service

---

Member 3 Agent

Allowed

ai-service

Denied

backend

frontend

database

---

Member 4 Agent

Allowed

admin

notifications

cache

socket

docker

Denied

auth

jobs

applications

ai-service

---

# 8. Scope Limitation Rules

Agents should solve only the requested task.

Do NOT:

- Refactor unrelated code
- Rename files
- Improve unrelated modules
- Modify other team's work

---

Good

Add Login API

Only touch auth files.

---

Bad

Add Login API

AND

Refactor Jobs Module

AND

Rename Database Fields

---

# 9. Maximum Change Size

Single Agent Task

Maximum:

5 files

Preferred:

1-3 files

---

Large changes should be split.

---

# 10. Documentation First Rule

Before implementing:

Check whether documentation exists.

---

If documentation conflicts with code:

Documentation wins.

Raise issue.

Do not silently change documentation.

---

# 11. Coding Standards Compliance

Reference:

docs/05_CODING_STANDARDS.md

---

Agents must follow:

Naming Standards

Error Handling Standards

Validation Standards

Response Standards

Security Standards

---

# 12. Security Rules

Agents must:

Validate Input

Hash Passwords

Use Environment Variables

Check Authorization

---

Agents must NOT:

Hardcode Secrets

Store Passwords

Expose Internal Errors

Log Sensitive Data

---

# 13. Environment Rules

Agents may use:

.env

for:

PORT

JWT_SECRET

MONGO_URI

REDIS_URL

AI_SERVICE_URL

---

Agents must never:

Commit .env

Hardcode Credentials

---

# 14. Testing Rules

Every generated feature must include:

Validation

Error Handling

Success Case

Authorization Check

---

Agents must not mark tasks complete without testing.

---

# 15. Logging Rules

Development

console.log()

Allowed

---

Production

Use logger utility

---

Never log:

Passwords

JWT Tokens

Secrets

Personal Information

---

# 16. Git Rules

Agents may:

Create files

Modify files

Generate tests

---

Agents may NOT:

Force Push

Delete Branches

Merge Pull Requests

Create Releases

Modify Repository Settings

---

# 17. Protected Files

These files are protected.

Agents may NOT edit:

docs/01_SYSTEM_ARCHITECTURE.md

docs/02_DATABASE_DESIGN.md

docs/03_API_CONTRACTS.md

docs/07_TEAM_OWNERSHIP.md

docs/10_AGENT_RULES.md

Without approval.

---

# 18. Agent Task Template

Every task should follow:

Step 1

Read relevant documentation.

---

Step 2

Identify owned module.

---

Step 3

Implement requested feature.

---

Step 4

Validate compliance.

---

Step 5

Generate tests.

---

Step 6

Return summary.

---

# 19. Agent Completion Checklist

Before finishing:

✓ Architecture unchanged

✓ Schema unchanged

✓ APIs unchanged

✓ Folder structure unchanged

✓ Ownership respected

✓ Validation added

✓ Error handling added

✓ Tests included

---

# 20. Prompt Template For Agents

Use this template.

You are working on DevConnect.

Read:

- PROJECT_OVERVIEW
- SYSTEM_ARCHITECTURE
- DATABASE_DESIGN
- API_CONTRACTS
- TEAM_OWNERSHIP
- AGENT_RULES

Follow all documented contracts.

Do not modify schemas.

Do not modify APIs.

Do not modify architecture.

Modify only files inside your assigned module.

Return only necessary changes.

---

# 21. Escalation Rules

Stop and request approval if:

- Schema changes required
- API changes required
- New dependency required
- Architecture changes required
- Cross-module modifications required

---

# 22. Success Criteria

An AI agent is considered compliant when:

✓ Works only inside assigned scope

✓ Follows documentation

✓ Produces maintainable code

✓ Causes zero merge conflicts

✓ Respects frozen contracts

---

# 23. Status

Status: APPROVED

Version: 1.0

Governance State: FROZEN

This document is mandatory for all AI-assisted development.