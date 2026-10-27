# DevConnect

Project Milestones & Evaluation Plan

Version: 1.0

Status: Approved

Project Duration:
10-week baseline; remaining milestones extended after frontend design

Team Size:
4 Members

Project Type:
Backend Engineering Project

---

# 1. Purpose

This document defines:

- Project Milestones
- Deliverables
- Review Checkpoints
- Completion Criteria
- Faculty Evaluation Points

This serves as the official project progress tracker.

---

# 2. Project Timeline

Weeks 1–5 (Completed ✅)

Milestones 0–4: Planning, Authentication, Student Portfolio, Recruiter & Job Management, Application Management

↓

Week 6 (Completed ✅)

Frontend Design Phase by Completed Milestone (Auth UI, Portfolio UI, Recruiter/Jobs UI, Applications UI)

↓

Weeks 7–10 (Sequential Member Milestones Rotation 🚀)

Each subsequent milestone is owned and driven sequentially by one member:
- Week 7: Milestone 5 — AI Skill Gap Analyzer & Student Career Intelligence (Member 1)
- Week 8: Milestone 6 — AI Candidate Match Scoring Engine & Recruiter Review (Member 2)
- Week 9: Milestone 7 — Core FastAPI AI Microservice, Resume Parser & Redis Caching (Member 3)
- Week 10: Milestone 8 — Realtime Notifications, Admin Dashboard & Multi-Container Dockerization (Member 4)
- Week 10 (Final): Milestone 9 — Cloud Deployment, Swagger Documentation & Final Academic Submission (All Members)

---

# 3. Milestone 0

Project Planning

Duration

Week 1

---

Objective

Freeze all documentation.

---

Deliverables

✓ Project Overview

✓ Architecture Design

✓ Database Design

✓ API Contracts

✓ Folder Structure

✓ Team Ownership

✓ Development Roadmap

✓ AI Design

---

Completion Criteria

All documents approved.

---

Review Demonstration

Show:

Architecture

Database Design

API Contracts

---

Weightage

10%

---

# 4. Milestone 1

Authentication & User Management

Duration

Week 2

Owner

Member 1

---

Deliverables

User Registration

Login

JWT Authentication

Role Authorization

Protected Routes

---

Demo

Register User

Login User

Access Protected Endpoint

---

Completion Criteria

Authentication fully functional.

---

Weightage

10%

---

# 5. Milestone 2

Student Portfolio System

Duration

Week 2

Owner

Member 1

---

Deliverables

Student Profile

Skills

Projects

Certifications

Resume Upload

---

Demo

Create Portfolio

Edit Portfolio

View Portfolio

Upload Resume

---

Completion Criteria

Portfolio system functional.

---

Weightage

10%

---

# 6. Milestone 3

Recruiter & Job Management

Duration

Weeks 3–4

Owner

Member 2

---

Deliverables

Recruiter Profile

Job CRUD

Search

Filtering

Pagination

---

Demo

Create Job

Edit Job

Delete Job

Search Job

---

Completion Criteria

Recruiter workflow functional.

---

Weightage

15%

---

# 7. Milestone 4

Application Management

Duration

Week 5

Owner

Member 2

---

Deliverables

Apply Job

Withdraw Application

Applicant List

Status Updates

---

Demo

Student Applies

Recruiter Reviews

Status Updated

---

Completion Criteria

End-to-end application workflow works.

---

Weightage

10%

---

# 8. Frontend Design Phase

Position

Immediately after Milestone 4 and before Milestone 5

Owner Mapping

- Member 1: Milestone 1 authentication UI
- Member 2: Milestone 2 student portfolio UI
- Member 3: Milestone 3 recruiter and jobs UI
- Member 4: Milestone 4 applications UI

Branch Mapping

- `feature/auth`
- `feature/recruitment`
- `feature/ai`
- `feature/admin-devops`

Rules

- Each member edits only the frontend paths assigned in `docs/07_TEAM_OWNERSHIP.md`.
- Shared routes, services, components, styles, and app-shell files require coordination.
- Every slice is submitted as a pull request into `develop`.
- No direct pushes to `develop` or `main`.

Deliverables

Authentication UI

Student Portfolio UI

Recruiter and Jobs UI

Applications UI

Responsive states and API integration preparation

Completion Criteria

Each frontend slice is reviewed, responsive, and integrated into `develop` without branch conflicts.

---

Schedule Extension & Execution Strategy


# Sequential Member Milestone Execution (Weeks 7–10)

Following the completion of the Frontend Design Phase for Milestones 1–4, each subsequent milestone is assigned sequentially in rotation to one member:
- **Milestone 5 (Week 7): Member 1** — AI Skill Gap Analyzer & Student Career Intelligence
- **Milestone 6 (Week 8): Member 2** — AI Candidate Match Scoring Engine & Recruiter Review
- **Milestone 7 (Week 9): Member 3** — Core FastAPI AI Microservice, Resume Parser & Redis Caching
- **Milestone 8 (Week 10): Member 4** — Realtime Notifications, Admin Dashboard & Multi-Container Dockerization
- **Milestone 9 (Week 10 Final): All Members** — Cloud Deployment, Swagger Documentation & Academic Submission

---

# 9. Milestone 5

AI Skill Gap Analyzer & Student Career Intelligence

Position:
Week 7 (Member 1 Milestone)

Duration:
Week 7 (4 Days)

Owner:
Member 1

Branch:
`feature/auth`

---

Deliverables:
- Skill Gap Analysis API endpoint (`POST /api/v1/ai/skill-gap`)
- Role taxonomy matrix matching student skills against industry roles (Backend, Frontend, Full Stack, Data Science, DevOps)
- Missing skills calculation and prioritized learning recommendations
- Career Advice & Skill Gap Visualizer on Student Dashboard
- Automated test suite in `tests/skillgap.test.js`

---

Demo:
Student selects target role (e.g. Backend Developer) -> receives instant skill gap breakdown, missing skill badges, and personalized learning recommendations.

---

Completion Criteria:
Skill Gap analysis functional, tested, and integrated into the student dashboard.

---

Weightage:
15%

---

# 10. Milestone 6

AI Candidate Match Scoring Engine & Recruiter Review

Position:
Week 8 (Member 2 Milestone)

Duration:
Week 8 (4 Days)

Owner:
Member 2

Branch:
`feature/recruitment`

---

Deliverables:
- Candidate Match Scoring API (`POST /api/v1/ai/match-candidate`)
- Match scoring algorithm: `(Matched Skills / Required Skills) * 100` with semantic skill normalization
- Database persistence in `ai_match_results` collection as per approved schema
- Recruiter Match Breakdown Drawer / Modal in Recruiter applicant review
- Match percentage pill/badge on applicant cards in Recruiter pipeline
- Automated test suite in `tests/matching.test.js`

---

Demo:
Recruiter inspects job applicants -> sees AI Match Percentage for each candidate and opens Match Breakdown drawer showing matched vs missing skills.

---

Completion Criteria:
Candidate matching engine functional, persisted in MongoDB, and integrated into recruiter review view.

---

Weightage:
15%

---

# 11. Milestone 7

Core FastAPI AI Microservice, Resume Parser & Redis Caching

Position:
Week 9 (Member 3 Milestone)

Duration:
Week 9 (4 Days)

Owner:
Member 3

Branch:
`feature/ai`

---

Deliverables:
- Independent Python FastAPI microservice architecture (`ai-service/app/`)
- Health check endpoint (`GET /api/v1/ai/health`)
- Resume Parser API (`POST /api/v1/ai/parse-resume`): PDF text extraction (`pdfplumber` / `PyPDF2`), skills dictionary normalization, education/project extraction
- Express backend gateway adapter forwarding resume uploads to FastAPI
- Interactive Resume Upload Modal with preview and one-click profile auto-population
- Redis Cloud Caching Layer (`backend/src/config/redis.js`, `backend/src/cache/`) for job listings, searches, and match results
- Pytest test suite for FastAPI service and Jest Redis cache hit/miss tests

---

Demo:
Student uploads PDF developer resume -> sees live extraction preview -> auto-fills portfolio with one click. High-traffic job searches return from Redis cache in < 50ms.

---

Completion Criteria:
FastAPI microservice running, resume parsing functional with frontend pre-fill, and Redis caching active.

---

Weightage:
10%

---

# 12. Milestone 8

Realtime Notifications, Admin Dashboard & Multi-Container Dockerization

Position:
Week 10 (Member 4 Milestone)

Duration:
Week 10 (4 Days)

Owner:
Member 4

Branch:
`feature/admin-devops`

---

Deliverables:
- Socket.IO realtime server (`backend/src/sockets/`) and event triggers (`application_submitted`, `candidate_shortlisted`, `candidate_rejected`, `job_created`)
- Notification Mongoose model, indexing, and REST APIs (`GET /api/v1/notifications`, `PATCH /api/v1/notifications/:id/read`)
- Interactive Notification Bell icon with live unread badge and toast alerts in student and recruiter portals
- Admin Dashboard APIs (`/api/v1/admin/dashboard`, `/api/v1/admin/users`, enable/disable toggles)
- System Audit Logging (`AuditLog` schema & event timeline middleware)
- Complete Admin Dashboard UI (`frontend/src/pages/admin/`): KPI cards, user management table, audit log viewer
- Multi-Container Dockerization: Backend, Frontend, and AI Dockerfiles + master `docker-compose.yml` linking all 5 services

---

Demo:
Student applies -> Recruiter receives instant realtime alert. Recruiter shortlists -> Student receives live toast notification. Admin manages users and inspects audit logs. Entire platform boots with `docker-compose up`.

---

Completion Criteria:
Realtime communication operational without page reloads, Admin dashboard functional, and Docker multi-container environment verified.

---

Weightage:
10%

---

# 13. Milestone 9

Cloud Deployment, Swagger Documentation & Final Academic Submission

Position:
Week 10 Final Wrap-up (All Members Milestone)

Duration:
Week 10 (Final Wrap-up & Defense)

Owners:
All 4 Members (Equal 25% Contribution)

---

Deliverables:
- Multi-Cloud Production Deployment:
  - Frontend to Vercel (Member 1)
  - Backend API to Render (Member 4)
  - AI Microservice to Render (Member 3)
  - MongoDB Atlas production cluster & Redis Cloud setup (Member 4)
  - Cloud smoke testing and production verification (Member 2)
- Interactive Swagger / OpenAPI Documentation at `/api/docs` covering all endpoints (All Members)
- Comprehensive Final Project Report (PDF) with individual module chapters (All Members)
- Complete Project Presentation Slide Deck (PPT) (All Members)
- 5–10 minute high-definition Video Walkthrough (Member 4 Lead with All Members)
- Git repository release tagged `v1.0.0` on `main` branch

---

Demo:
Live cloud deployment walkthrough on public URLs, architecture presentation, and faculty viva defense.

---

Completion Criteria:
Production URLs live, all documentation completed, and successful academic project defense.

---

Weightage:
10%

---

# 14. 4-Member Sequential Contribution Matrix

| Team Member | Completed Foundation | Assigned Sequential Milestone | Overall Contribution |
|---|---|---|---|
| **Member 1** | Milestones 1 & 2 (Auth + Student Portfolio backend, 35 tests), Milestone 1 Auth UI | **Milestone 5:** AI Skill Gap Analyzer & Student Career Intelligence (`POST /api/v1/ai/skill-gap`), Student AI Dashboard UI, Vercel Deployment, Final Report & Viva | **25%** |
| **Member 2** | Milestones 3 & 4 (Recruiter + Jobs + Applications backend, 10 tests), Milestone 2 Portfolio UI | **Milestone 6:** AI Candidate Match Scoring Engine (`POST /api/v1/ai/match-candidate`), `AIMatchResult` DB storage, Recruiter Match Breakdown UI, Smoke Testing, Final Report & Viva | **25%** |
| **Member 3** | Milestone 3 Recruiter & Jobs UI | **Milestone 7:** Core FastAPI Microservice, AI Resume Parser Engine & UI (`POST /api/v1/ai/parse-resume`), Redis Caching Layer, AI Dockerfile, Pytest Suite, Final Report & Viva | **25%** |
| **Member 4** | Milestone 4 Applications UI & Recruiter Review | **Milestone 8:** Realtime Socket.IO Server & Notification Bell, Admin Dashboard & APIs, Audit Logging, Docker Compose, Swagger Lead, Render Deployment, Demo Video, Final Report & Viva | **25%** |

---

# 14. Weekly Review Template

Week Number

Completed Tasks

Pending Tasks

Issues

Files Modified

Pull Requests

Next Week Goals

---

# 15. Faculty Evaluation Mapping

Backend Engineering Topics Covered

✓ REST APIs

✓ Authentication

✓ Authorization

✓ Database Design

✓ CRUD Operations

✓ Validation

✓ Error Handling

✓ File Uploads

✓ Microservices

✓ Caching

✓ Real-Time Communication

✓ Docker

✓ Deployment

✓ Testing

✓ Documentation

---

# 16. CHO Coverage Mapping

Module

Authentication

CHO Coverage

Security & Authentication

---

Module

Student Portfolio

CHO Coverage

CRUD Operations

Database Integration

---

Module

Recruitment System

CHO Coverage

REST API Development

---

Module

Applications

CHO Coverage

Business Logic

Database Transactions

---

Module

AI Service

CHO Coverage

Microservice Architecture

API Communication

---

Module

Notifications

CHO Coverage

Realtime Backend Systems

---

Module

Redis

CHO Coverage

Caching

Performance Optimization

---

Module

Docker

CHO Coverage

Containerization

Deployment

---

# 17. Success Metrics

Project is successful when:

✓ All Milestones Completed

✓ Documentation Complete

✓ Backend APIs Functional

✓ AI Features Functional

✓ Deployment Successful

✓ Testing Completed

✓ Faculty Requirements Satisfied

---

# 18. Final Deliverables Checklist

Documentation

✓

Source Code

✓

Deployment URL

✓

PPT

✓

Demo Video

✓

API Documentation

✓

Database Design

✓

ER Diagram

✓

Testing Report

✓

---

# 19. Approval

Status: APPROVED

Version: 1.0

Milestone State: FROZEN