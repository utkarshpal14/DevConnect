# DevConnect

AI Agent Rules & Governance Document

Version: 1.0

Status: Mandatory

---

# 1. Mandatory Reading

Before any task, agents must read:

1. `docs/00_PROJECT_OVERVIEW.md`
2. `docs/01_SYSTEM_ARCHITECTURE.md`
3. `docs/02_DATABASE_DESIGN.md`
4. `docs/03_API_CONTRACTS.md`
5. `docs/04_FOLDER_STRUCTURE.md`
6. `docs/07_TEAM_OWNERSHIP.md`
7. `docs/09_DEVELOPMENT_ROADMAP.md`
8. `docs/10_AGENT_RULES.md`

If a required document is missing, stop and request clarification.

# 2. Architecture, Schema, and API Protection

Agents must not introduce services, databases, frameworks, communication flows, collections, fields, endpoints, methods, or payload changes without approval. Frontend-to-database and AI-service-to-database access are forbidden.

# 3. Ownership Paths

Agents must follow the path ownership matrix in `docs/07_TEAM_OWNERSHIP.md`:

- Member 1: authentication and student paths.
- Member 2: recruitment paths.
- Member 3: `ai-service/*` plus approved AI adapter routes/controllers.
- Member 4: admin, notification, infrastructure, documentation, and DevOps paths.

Shared paths require coordination with the affected owner.

# 4. Scope and Change Limits

Solve only the requested task. Prefer one to three files and never exceed five files for a single agent task unless explicitly approved. Do not rename, move, duplicate, or refactor unrelated modules.

# 5. Security Requirements

- Validate all input.
- Hash passwords with bcrypt.
- Read secrets from environment variables.
- Check authentication and role authorization.
- Never commit `.env` files.
- Never log passwords, tokens, secrets, or personal information.
- Do not expose stack traces or internal errors.

# 6. Testing Requirements

Every feature must cover its success case, validation failure, error handling, and authorization behavior. Agents must not mark work complete without running the relevant tests or validation command.

# 7. Frontend Design Requirements

Frontend agents must produce natural, distinctive, human-designed interfaces
that fit the DevConnect product and the user's task. They must not default to
generic AI-generated layouts, dark themes, dark blue themes, purple-on-white
palettes, excessive gradients, glowing blobs, bokeh, oversized marketing
heroes, or nested card-heavy dashboards.

Frontend work must include deliberate typography, color hierarchy, spacing,
responsive behavior, meaningful states, and restrained purposeful motion. The
result must be checked for content overlap, clipping, overflow, and mobile
breakage before completion.

# 8. Completion Checklist

- Architecture unchanged.
- Database schema unchanged.
- API contracts unchanged.
- Ownership respected.
- Validation and error handling included.
- Frontend design follows the human-made visual design requirements.
- Tests executed and reported.

# 9. Status

Status: APPROVED

Version: 1.0

Governance State: FROZEN
