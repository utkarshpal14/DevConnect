# DevConnect

Team Ownership Document

Version: 1.0

Status: Team Structure Freeze

---

# 1. Purpose

This document defines:

- Team responsibilities
- Module ownership
- API ownership
- Database ownership
- Git branch ownership
- Agent permissions
- Conflict prevention rules

This document is the single source of truth for task allocation.

---

# 2. Team Structure

Total Team Members: 4

Team Distribution Strategy:

We follow MODULE OWNERSHIP.

We DO NOT divide work by:

❌ Frontend
❌ Backend
❌ Database
❌ AI

This creates bottlenecks.

Instead we divide by BUSINESS DOMAINS.

Each member owns an entire module from database to frontend integration.

---

# 3. Member 1

Role:

Authentication & User Management Lead

---

Responsibilities

- Registration
- Login
- JWT Authentication
- Password Hashing
- Role-Based Access Control
- User Management
- Security Middleware

---

Database Ownership

users

---

API Ownership

/api/v1/auth/*

---

Folder Ownership

backend/src/auth

backend/src/middleware

backend/src/users

---

Allowed Actions

Can:

- Create auth controllers
- Create auth services
- Create middleware
- Create validators

---

Cannot Modify

jobs

applications

notifications

admin

ai-service

---

Branch

feature/auth

---

Deliverables

User Schema Integration

Register API

Login API

JWT Middleware

Role Middleware

Password Security

Auth Tests

---

# 4. Member 2

Role:

Recruitment Module Lead

---

Responsibilities

- Job Management
- Application Management
- Search
- Filtering
- Pagination
- Recruiter Features

---

Database Ownership

jobs

applications

---

API Ownership

/api/v1/jobs/*

/api/v1/applications/*

---

Folder Ownership

backend/src/jobs

backend/src/applications

backend/src/recruiters

---

Allowed Actions

Can:

- Create Job APIs
- Create Application APIs
- Create Recruiter APIs
- Implement Search

---

Cannot Modify

auth

users

admin

notifications

ai-service

---

Branch

feature/recruitment

---

Deliverables

Job CRUD

Application CRUD

Search APIs

Pagination

Filtering

Recruiter Dashboard APIs

---

# 5. Member 3

Role:

AI Engineering Lead

---

Responsibilities

- Resume Parsing
- Candidate Matching
- Skill Gap Analysis
- FastAPI Service

---

Database Ownership

ai_match_results

(Read Only Access To)

student_profiles

jobs

---

API Ownership

/api/v1/ai/*

---

Folder Ownership

ai-service/

---

Allowed Actions

Can:

- Create AI APIs
- Create Matching Logic
- Create Resume Parser
- Create AI Models

---

Cannot Modify

backend/*

frontend/*

database schemas

---

Branch

feature/ai

---

Deliverables

Resume Parser

Candidate Matching

Skill Gap Analyzer

FastAPI APIs

AI Testing

---

# 6. Member 4

Role:

Admin, Realtime & DevOps Lead

---

Responsibilities

- Admin Module
- Notifications
- Socket.IO
- Redis
- Swagger
- Docker
- Deployment

---

Database Ownership

notifications

audit_logs

---

API Ownership

/api/v1/admin/*

/api/v1/notifications/*

---

Folder Ownership

backend/src/admin

backend/src/notifications

backend/src/cache

backend/src/socket

docker/

---

Allowed Actions

Can:

- Create Admin APIs
- Create Notification System
- Configure Redis
- Configure Docker
- Configure Deployment

---

Cannot Modify

auth

jobs

applications

ai-service

---

Branch

feature/admin-devops

---

Deliverables

Admin Dashboard

Socket.IO

Redis Cache

Swagger Docs

Docker Setup

Deployment Setup

---

# 7. Shared Ownership

The following folders are shared.

frontend/

docs/

---

Rules

Changes require approval.

Pull latest develop branch before editing.

---

# 8. Frontend Ownership Strategy

Frontend is divided by pages.

Member 1

Auth Pages

- Login
- Register

---

Member 2

Recruitment Pages

- Jobs
- Applications

---

Member 3

AI Pages

- AI Analysis
- Match Results

---

Member 4

Admin Pages

- Dashboard
- Analytics

---

# 9. Git Branch Strategy

Protected Branches

main

develop

---

Feature Branches

feature/auth

feature/recruitment

feature/ai

feature/admin-devops

---

Workflow

feature branch

↓

Pull Request

↓

develop

↓

Testing

↓

main

---

# 10. Pull Request Rules

Before creating PR:

Developer must:

- Pull latest develop
- Run project locally
- Run tests
- Resolve conflicts

---

PR Description Must Include

Module

Changes Made

Files Modified

Testing Evidence

---

# 11. Conflict Prevention Rules

Rule 1

One Module = One Owner

Nobody edits another module.

---

Rule 2

Database Schema Frozen

No changes without approval.

---

Rule 3

API Contracts Frozen

No changes without approval.

---

Rule 4

Folder Structure Frozen

No changes without approval.

---

Rule 5

AI Agents Cannot Cross Boundaries

Agents may only edit owned modules.

---

# 12. Agent Permissions Matrix

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

database changes

---

Member 4 Agent

Allowed

admin

notifications

cache

docker

Denied

auth

jobs

applications

ai-service

---

# 13. Weekly Reporting

Every Week Each Member Must Submit

Completed Tasks

Current Blockers

Files Modified

Next Week Plan

---

# 14. Success Criteria

Team Ownership Document is successful when:

- Members work independently.
- Git conflicts remain minimal.
- AI agents stay within scope.
- Contributions are clearly visible.
- Project progresses in parallel.

---

# 15. Status

Status: APPROVED

Version: 1.0

Ownership Structure: FROZEN