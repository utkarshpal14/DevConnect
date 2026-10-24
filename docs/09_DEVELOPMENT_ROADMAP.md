# DevConnect

Development Roadmap

Version: 1.0

Status: Execution Plan

Project Duration: 10 Weeks baseline; remaining milestones extended after the frontend phase

Team Size: 4 Members

Development Strategy:

Documentation First
Architecture First
Database First
API First
Code Later

---

# Current Schedule

Weeks 1–5 (Completed ✅)

Backend Milestones 0–4 (Foundation, Auth, Student Portfolio, Recruiter & Jobs, Applications)

↓

Week 6 (Completed ✅)

Frontend Design Phase for Milestones 1–4 (Member 1: Auth UI, Member 2: Portfolio UI, Member 3: Recruiter/Jobs UI, Member 4: Applications UI)

↓

Weeks 7–10 (Sequential Member Milestones Rotation 🚀)

Each subsequent milestone is owned and driven sequentially by one member:
- Week 7: Milestone 5 — AI Skill Gap Analyzer & Student Career Intelligence (Member 1)
- Week 8: Milestone 6 — AI Candidate Match Scoring Engine & Recruiter Review (Member 2)
- Week 9: Milestone 7 — Core AI Microservice, Resume Parser & Redis Caching (Member 3)
- Week 10: Milestone 8 — Realtime Notifications, Admin Dashboard & Dockerization (Member 4)
- Week 10 (Final): Milestone 9 — Cloud Deployment, Swagger Documentation & Final Academic Submission (All Members)

---

# Phase 0

Project Foundation

Duration:
2 Days

---
Approve Database Design

Approve API Contracts

Approve Team Ownership

Approve Roadmap

---

Deliverables

00_PROJECT_OVERVIEW.md

01_SYSTEM_ARCHITECTURE.md

02_DATABASE_DESIGN.md

03_API_CONTRACTS.md

07_TEAM_OWNERSHIP.md

09_DEVELOPMENT_ROADMAP.md

---

Exit Criteria

No coding starts until all documents are approved.

---

# Phase 1

Project Setup

Duration:
2 Days

---

Objective

Prepare development environment.

---

Member 1

Setup Backend

Tasks

Create Express Application

Setup Environment Variables

Setup MongoDB Connection

Setup Error Handling

Setup Validation Framework

---

Member 2

Setup Recruitment Module Structure

Create:

jobs/

applications/

recruiters/

folders

---

Member 3

Setup AI Service

Tasks

Create FastAPI Project

Create AI Folder Structure

Configure Python Environment

Create Health Check Endpoint

---

Member 4

Setup DevOps Infrastructure

Tasks

Configure Docker Structure

Configure Swagger Base

Configure Socket.IO Base

Configure Redis Connection

---

Deliverables

Backend Running

Frontend Running

AI Service Running

MongoDB Connected

Redis Connected

---

Exit Criteria

All services start successfully.

---

# Phase 2

Authentication Module

Duration:
4 Days

Owner:
Member 1

---

Objective

Build secure authentication system.

---

Tasks

Create User Model

Implement Registration API

Implement Login API

Hash Passwords

Generate JWT

Create Authentication Middleware

Create Authorization Middleware

Create Role Validation

---

Testing

Register User

Login User

Protected Route Test

Role Access Test

---

Deliverables

Working Authentication System

JWT Security

Role-Based Access Control

---

Exit Criteria

Users can register and login.

---

# Phase 3

Student Portfolio Module

Duration:
4 Days

Owner:
Member 1

---

Objective

Allow students to build professional profiles.

---

Tasks

Create Student Profile Model

Create Profile APIs

Add Skills APIs

Add Projects APIs

Add Certifications APIs

Add Achievement APIs

Resume Upload API

Profile Retrieval API

Profile Update API

---

Testing

Create Profile

Update Profile

Upload Resume

Retrieve Profile

---

Deliverables

Complete Student Profile System

---

Exit Criteria

Students can manage full profiles.

---

# Phase 4

Recruiter Module

Duration:
5 Days

Owner:
Member 2

---

Objective

Allow recruiters to manage company information.

---

Tasks

Create Recruiter Profile Model

Create Recruiter APIs

Update Recruiter APIs

View Recruiter Profile

---

Testing

Create Recruiter

Update Recruiter

Retrieve Recruiter

---

Deliverables

Recruiter Profile Management

---

Exit Criteria

Recruiters can manage company profiles.

---

# Phase 5

Job Management Module

Duration:
5 Days

Owner:
Member 2

---

Objective

Create recruitment platform functionality.

---

Tasks

Create Job Model

Create Job APIs

Get All Jobs

Get Single Job

Update Job

Delete Job

Close Job

Implement Search

Implement Filtering

Implement Pagination

---

Testing

Create Job

Search Job

Filter Job

Pagination

Update Job

Delete Job

---

Deliverables

Complete Job Management System

---

Exit Criteria

Recruiters can manage jobs.

Students can browse jobs.

---

# Phase 6

Application Module

Duration:
4 Days

Owner:
Member 2

---

Objective

Handle job applications.

---

Tasks

Create Application Model

Apply Job API

Withdraw Application API

View Applications API

Recruiter Applicant View API

Application Status Update API

Validation Rules

Duplicate Application Prevention

---

Testing

Apply Job

Withdraw Application

Status Update

View Applicants

---

Deliverables

Complete Application System

---

Exit Criteria

Students can apply to jobs.

Recruiters can manage applications.

---

# Phase 7

Frontend Design by Completed Milestone

Duration:
5 Days

Owners:
Members 1, 2, 3, and 4 by assigned frontend slice

---

Objective

Design and prepare the frontend for the completed backend milestones before
continuing with AI, notifications, and administration work.

---

Ownership

- Member 1: Milestone 1 authentication UI on `feature/auth`.
- Member 2: Milestone 2 student portfolio UI on `feature/recruitment`.
- Member 3: Milestone 3 recruiter and jobs UI on `feature/ai`.
- Member 4: Milestone 4 applications UI on `feature/admin-devops`.

---

Rules

- Each member modifies only their assigned frontend paths.
- Shared routes, services, components, styles, and app-shell files require coordination.
- Each slice is submitted through a pull request into `develop`.
- No direct pushes to `develop` or `main`.

---

Tasks

Create milestone-specific pages and components

Connect completed backend API contracts

Add loading, empty, error, success, and disabled states

Verify desktop, tablet, and mobile layouts

Complete visual design review

---

Exit Criteria

All four frontend slices are reviewed and integrated into `develop` without
ownership or branch conflicts.

---

---

# Sequential Execution Plan for Remaining Phases (Weeks 7–10)

Following the completion of backend Milestones 1–4 and the unified Frontend Design Phase (where Member 1 designed auth, Member 2 designed student portfolio, Member 3 designed recruiter/jobs, and Member 4 designed applications), all remaining milestones are assigned sequentially in rotation across the four team members:

1. **Phase 8 (Milestone 5): Member 1** — AI Skill Gap Analyzer & Student Career Intelligence
2. **Phase 9 (Milestone 6): Member 2** — AI Candidate Match Scoring Engine & Recruiter Review
3. **Phase 10 (Milestone 7): Member 3** — Core FastAPI AI Microservice, Resume Parser & Redis Caching
4. **Phase 11 (Milestone 8): Member 4** — Realtime Notifications (Socket.IO), Admin Dashboard & Dockerization
5. **Phase 12 (Milestone 9): All Members** — Cloud Deployment, Swagger Documentation & Final Academic Submission

---

# Phase 8

Milestone 5 — AI Skill Gap Analyzer & Student Career Intelligence

Duration:
Week 7 (4 Days)

Owner:
Member 1

Branch:
`feature/auth`

---

Objective:
Empower students with AI-driven career guidance by analyzing their profile skills against target industry roles and providing actionable learning recommendations.

---

Tasks:
- Create Skill Gap Analysis API endpoint: `POST /api/v1/ai/skill-gap`
- Define role taxonomy matrix for common industry profiles (Backend Developer, Frontend Developer, Full-Stack Engineer, Data Scientist, DevOps Engineer)
- Implement matching comparison between student's actual skills and expected target role requirements
- Compute:
  - Missing skills list
  - Actionable learning recommendations & project suggestions
  - Career readiness score percentage
- Develop frontend UI on Student Dashboard:
  - Role selection dropdown / career target selector
  - Skill Gap Visualizer with acquired vs missing skill tags
  - Personalized recommendation cards with "Add to Learning Plan" action
- Write unit and API tests in `tests/skillgap.test.js` covering role comparisons, edge cases, and authorization

---

Testing:
- Valid student profile with partial skill overlap
- Profile with 100% skill match (zero missing skills)
- Profile with no overlapping skills
- Authorization check: only authenticated students can request career analysis

---

Deliverables:
- Working `POST /api/v1/ai/skill-gap` API
- Interactive Career Intelligence & Skill Gap dashboard component in React frontend
- Automated test suite for skill gap analysis

---

Exit Criteria:
Students can select any target career track and instantly receive missing skills analysis and personalized learning recommendations.

---

# Phase 9

Milestone 6 — AI Candidate Match Scoring Engine & Recruiter Review

Duration:
Week 8 (4 Days)

Owner:
Member 2

Branch:
`feature/recruitment`

---

Objective:
Provide recruiters with automated candidate evaluation intelligence by calculating compatibility scores between job applicants and job requirements.

---

Tasks:
- Create Candidate Matching API endpoint: `POST /api/v1/ai/match-candidate`
- Implement candidate scoring formula: `Match Score = (Matched Skills / Required Skills) * 100`
- Implement semantic skill normalization (e.g., "NodeJS" == "Node.js", "React.js" == "React")
- Persist match evaluation records in `ai_match_results` collection as defined in `docs/02_DATABASE_DESIGN.md`
- Integrate AI match evaluation into Recruiter workflow:
  - Display Match Percentage pill/badge on applicant cards in Recruiter Applicant Pipeline
  - Build interactive Match Breakdown Drawer/Modal showing matched skills (green chips) vs missing skills (red chips)
  - Allow recruiters to filter and sort applicants by Match Score
- Write automated tests in `tests/matching.test.js` validating score precision, skill overlap logic, and recruiter authorization

---

Testing:
- 100% exact skill match scenario
- Partial match scenario with mixed skills
- 0% match scenario (no shared skills)
- Verification that match results persist correctly in `ai_match_results`

---

Deliverables:
- Working `POST /api/v1/ai/match-candidate` API
- `AIMatchResult` Mongoose schema and database integration
- Recruiter Match Breakdown Drawer component in React frontend
- Automated test suite for candidate matching

---

Exit Criteria:
Recruiters can see calculated AI Match Scores and detailed skill comparisons for all job applicants.

---

# Phase 10

Milestone 7 — Core FastAPI AI Microservice, Resume Parser & Redis Caching

Duration:
Week 9 (4 Days)

Owner:
Member 3

Branch:
`feature/ai`

---

Objective:
Establish the independent Python FastAPI AI microservice, implement automated PDF resume parsing, and integrate Redis Cloud caching for query acceleration.

---

Tasks:
- Scaffold FastAPI AI microservice in `ai-service/app/`:
  - Main application entrypoint (`app/main.py`), CORS configuration, health check endpoint (`GET /api/v1/ai/health`)
  - Pydantic models for request/response serialization
- Implement Resume Parsing Engine:
  - Text extraction from uploaded PDF resumes using `pdfplumber` / `PyPDF2`
  - Extraction and normalization of skills against standardized `skills_dictionary.json`
  - Extraction of education, project experience, and certifications
  - Build FastAPI endpoint: `POST /api/v1/ai/parse-resume`
- Connect Express backend gateway adapter to forward student resume uploads to FastAPI
- Develop frontend Resume Upload Modal:
  - PDF drag-and-drop file upload with 5MB validation
  - Real-time extraction preview showing parsed skills, education, and projects
  - One-click "Apply to My Profile" button to auto-populate student portfolio
- Implement Redis Cloud Caching Layer:
  - Configure Redis client in `backend/src/config/redis.js`
  - Implement caching middleware for public job listings (`/api/v1/jobs`), search queries, and match scores
  - Add cache invalidation hooks on job creation, updates, and application status changes
- Write Pytest test suite for FastAPI service and Jest cache hit/miss tests

---

Testing:
- Upload various PDF resume formats (single-column, two-column) and verify extraction accuracy
- Verify graceful error handling on corrupt or non-PDF files
- Benchmark API performance: Redis cache hit returns under 50ms vs cache miss

---

Deliverables:
- Running FastAPI microservice on port 8000
- `POST /api/v1/ai/parse-resume` API
- Interactive Resume Upload & Auto-fill UI component in React frontend
- Redis caching layer in Express backend
- Pytest and cache test suites

---

Exit Criteria:
Students can upload a PDF resume to have their portfolio pre-filled automatically, and public job searches return from Redis cache in < 100ms.

---

# Phase 11

Milestone 8 — Realtime Notifications, Admin Dashboard & Multi-Container Dockerization

Duration:
Week 10 (4 Days)

Owner:
Member 4

Branch:
`feature/admin-devops`

---

Objective:
Implement real-time WebSocket communication, administrative platform governance, audit logging, and full containerization with Docker.

---

Tasks:
- Set up Socket.IO server on Express backend (`backend/src/sockets/`):
  - Handle client connections and user authentication rooms
  - Emit realtime events: `application_submitted`, `candidate_shortlisted`, `candidate_rejected`, `job_created`
- Implement Notification System:
  - `Notification` Mongoose model (`userId`, `title`, `message`, `isRead`, `createdAt`)
  - Notification APIs: `GET /api/v1/notifications`, `PATCH /api/v1/notifications/:id/read`
  - Frontend Notification Bell icon with live unread badge and dropdown menu for student and recruiter portals
  - Live toast popup notifications on application status changes
- Build Admin Dashboard & Audit Logging:
  - `AuditLog` Mongoose model (`actorId`, `action`, `entityType`, `entityId`, `createdAt`)
  - Admin APIs: `GET /api/v1/admin/dashboard` (KPI statistics), `GET /api/v1/admin/users`, `PATCH /api/v1/admin/users/:id/disable` & `enable`
  - Admin Dashboard UI (`frontend/src/pages/admin/`): Metric cards, user management table, audit log timeline
- Multi-Container Dockerization:
  - Backend Dockerfile (`docker/backend/Dockerfile`) with Node.js 20
  - Frontend Dockerfile (`docker/frontend/Dockerfile`) with multi-stage build
  - AI Service Dockerfile (`docker/ai-service/Dockerfile`) with Python 3.11 slim
  - Master `docker/docker-compose.yml` linking Frontend, Backend, AI Microservice, MongoDB, and Redis
- Write automated tests for Socket.IO events and Admin APIs

---

Testing:
- Trigger job application and verify recruiter receives instantaneous notification event
- Trigger status update and verify student receives live toast
- Verify admin-only RBAC protection on all `/api/v1/admin/*` routes
- Run `docker-compose up --build` and verify all 5 containers start up healthy and interconnected

---

Deliverables:
- Socket.IO realtime server and interactive notification components
- Notification Mongoose model and REST APIs
- Complete Admin Dashboard interface and Audit Logging service
- Production-grade Dockerfiles and master `docker-compose.yml`
- Realtime and Admin test suites

---

Exit Criteria:
Realtime notifications deliver instantly without page reload, Admin can manage platform accounts, and the entire platform boots with `docker-compose up`.

---

# Phase 12

Milestone 9 — Cloud Deployment, Swagger Documentation & Final Academic Submission

Duration:
Week 10 (Final Wrap-up & Defense)

Owners:
All 4 Members (Equal 25% Contribution)

---

Objective:
Deploy the complete ecosystem to public cloud infrastructure, document all APIs, and deliver the final academic project submission and faculty viva defense.

---

Tasks:
- Production Multi-Cloud Deployment:
  - Member 1: Deploy React frontend to Vercel with custom domain and routing rewrites (`vercel.json`)
  - Member 4: Deploy Express backend to Render Web Service, configure MongoDB Atlas production cluster and Redis Cloud
  - Member 3: Deploy FastAPI AI microservice to Render Web Service with Python runtime
  - Member 2: Perform end-to-end cloud smoke testing across live production URLs
- Interactive Swagger / OpenAPI Documentation (`/api/docs`):
  - Member 4: Set up Swagger UI base configuration in Express
  - Member 1: Document Authentication, Student Portfolio, and Skill Gap APIs
  - Member 2: Document Recruiter, Job, and Application APIs
  - Member 3: Document AI Service and Redis Cache behaviors
- Comprehensive Academic Deliverables:
  - Member 1: Project Report chapters (Auth, Student Portfolio, AI Skill Gap Analysis) & Viva defense on Security and RBAC
  - Member 2: Project Report chapters (Recruiter, Jobs, Applications, Candidate Matching) & Live demo of Recruiter workflow
  - Member 3: Project Report chapters (Microservice Architecture, Resume Parsing, Redis Caching) & Live demo of AI extraction
  - Member 4: Project Report chapters (Realtime WebSockets, Admin Operations, Docker, Cloud Deployment) & Demonstration video recording

---

Testing:
- Run unified backend test suite: `npm test` (all tests passing)
- Run AI test suite: `pytest`
- Run frontend build: `npm run build`
- Zero critical defects across live cloud deployments

---

Deliverables:
- Live production URLs:
  - Frontend: `https://devconnect.vercel.app`
  - Backend API: `https://devconnect-api.onrender.com`
  - AI Microservice: `https://devconnect-ai.onrender.com`
  - Interactive Swagger Docs: `https://devconnect-api.onrender.com/api/docs`
- Comprehensive Final Project Report (PDF)
- Project Presentation Slide Deck (PPT)
- 5–10 minute high-definition Video Walkthrough
- Git repository release tagged `v1.0.0` on `main` branch

---

Exit Criteria:
All academic deliverables submitted and approved; successful faculty viva defense.

---

# Sequential Member Milestone Summary

| Milestone | Stage | Primary Owner | Key Deliverable | Branch |
|---|---|---|---|---|
| **Milestone 1** | Foundation | **Member 1** | Authentication, JWT, RBAC & Current User API | `feature/auth` |
| **Milestone 2** | Foundation | **Member 1** | Student Portfolio System, Resume Upload & Skills | `feature/auth` |
| **Milestone 3** | Foundation | **Member 2** | Recruiter Profile, Job CRUD, Search & Pagination | `feature/recruitment` |
| **Milestone 4** | Foundation | **Member 2** | Application Pipeline, Status Updates & Applicant Review | `feature/recruitment` |
| **Frontend Phase** | Unified UI | **All Members** | Member 1: Auth UI \| Member 2: Portfolio UI \| Member 3: Recruiter/Jobs UI \| Member 4: Applications UI | Feature Branches |
| **Milestone 5** | Remaining Work | **Member 1** | AI Skill Gap Analyzer & Student Career Intelligence | `feature/auth` |
| **Milestone 6** | Remaining Work | **Member 2** | AI Candidate Match Scoring Engine & Recruiter Review | `feature/recruitment` |
| **Milestone 7** | Remaining Work | **Member 3** | Core FastAPI AI Microservice, Resume Parser & Redis Caching | `feature/ai` |
| **Milestone 8** | Remaining Work | **Member 4** | Realtime Notifications, Admin Dashboard & Dockerization | `feature/admin-devops` |
| **Milestone 9** | Project Conclusion | **All Members** | Multi-Cloud Deployment, Swagger Documentation & Final Submission | All Branches / `main` |

---

# 4-Member Contribution Balance

Every member achieves exactly **25% overall contribution** across the complete project lifecycle:
- **Member 1 (25%):** Milestones 1 & 2 (Auth + Student Portfolio backend) + Milestone 1 Auth UI + Milestone 5 (AI Skill Gap Analyzer & Career Intelligence) + Vercel Deployment + Final Report/Viva
- **Member 2 (25%):** Milestones 3 & 4 (Recruiter + Jobs + Applications backend) + Milestone 2 Portfolio UI + Milestone 6 (AI Candidate Match Scoring Engine) + Production Smoke Testing + Final Report/Viva
- **Member 3 (25%):** Milestone 3 Recruiter & Jobs UI + Milestone 7 (FastAPI Microservice, AI Resume Parser & Redis Caching) + AI Dockerfile + Pytest Suite + Final Report/Viva
- **Member 4 (25%):** Milestone 4 Applications UI + Milestone 8 (Realtime Notifications, Admin Dashboard & Dockerization) + Swagger Lead + Render/Cloud Infrastructure + Demo Video Walkthrough + Final Report/Viva

---

# Weekly Review Process

Every Saturday:
- Each Member submits completed work, pending work, blockers, files modified, and PR links
- Synchronize feature branches with `develop`
- Verify automated test suites

---

# Agent Work Rules

Before Every Task:
- Read `docs/00_PROJECT_OVERVIEW.md`
- Read `docs/01_SYSTEM_ARCHITECTURE.md`
- Read `docs/02_DATABASE_DESIGN.md`
- Read `docs/03_API_CONTRACTS.md`
- Read `docs/07_TEAM_OWNERSHIP.md`

Agents Must NOT:
- Modify Schema without approval
- Modify APIs without approval
- Modify Folder Structure without approval
- Modify Another Member's Module without approval

---

---

# Roadmap Status

Status: APPROVED

Version: 1.0

Execution Strategy: FROZEN