# DevConnect

Developer Portfolio & Campus Recruitment Portal

DevConnect is a full-stack web platform that connects students and recruiters through developer portfolios, job opportunities, AI-powered candidate analysis, and recruitment management.

It combines the best aspects of:

- LinkedIn (Professional Profiles)
- GitHub Portfolio Showcase
- Job & Internship Portal
- AI Career Assistant

---

## Project Overview

Students can create professional developer portfolios containing:

- Skills
- Projects
- Certifications
- Resume
- GitHub Links
- LinkedIn Links
- Achievements

Recruiters can:

- Create Company Profiles
- Post Jobs & Internships
- Search Candidates
- Review Applications
- Shortlist Candidates
- Manage Recruitment Pipeline

The platform also provides AI-powered features:

- Resume Parsing
- Candidate Match Scoring
- Skill Gap Analysis

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- JWT Authentication
- Socket.IO

### Database

- MongoDB Atlas

### Cache

- Redis Cloud

### AI Service

- FastAPI
- PyPDF2
- pdfplumber
- Sentence Transformers
- Scikit-Learn

### DevOps

- Docker
- Docker Compose
- GitHub

### Deployment

- Vercel (Frontend)
- Render (Backend)
- Render (AI Service)
- MongoDB Atlas
- Redis Cloud

---

# Repository Structure

```text
DevConnect/

├── docs/
│
├── frontend/
│
├── backend/
│
├── ai-service/
│
├── docker/
│
└── README.md
```

---

# Documentation Index

## Core Planning Documents

| Document | Purpose |
|-----------|----------|
| 00_PROJECT_OVERVIEW.md | Complete project vision and scope |
| 01_SYSTEM_ARCHITECTURE.md | High-level architecture design |
| 02_DATABASE_DESIGN.md | MongoDB schema definitions |
| 03_API_CONTRACTS.md | API specifications |
| 04_FOLDER_STRUCTURE.md | Repository structure |

---

## Engineering Governance

| Document | Purpose |
|-----------|----------|
| 05_CODING_STANDARDS.md | Coding conventions |
| 06_GIT_WORKFLOW.md | Git branching and PR process |
| 07_TEAM_OWNERSHIP.md | Module ownership |
| 10_AGENT_RULES.md | AI Agent governance |

---

## AI Documentation

| Document | Purpose |
|-----------|----------|
| 08_AI_SERVICE_SPEC.md | AI service architecture and APIs |

---

## Execution Documents

| Document | Purpose |
|-----------|----------|
| 09_DEVELOPMENT_ROADMAP.md | Development plan |
| 15_PROJECT_MILESTONES.md | Milestone tracking |

---

## Operations Documents

| Document | Purpose |
|-----------|----------|
| 11_DEPLOYMENT_PLAN.md | Deployment architecture |
| 12_TESTING_STRATEGY.md | Testing process |

---

## Academic Documentation

| Document | Purpose |
|-----------|----------|
| 13_SRS.md | Software Requirements Specification |
| 14_ER_DIAGRAM.md | Entity Relationship Diagram |

---

# Team Structure

## Member 1

Module Ownership:

- Authentication
- Users
- Student Profiles
- Middleware

Branch:

```bash
feature/auth
```

---

## Member 2

Module Ownership:

- Recruiters
- Jobs
- Applications

Branch:

```bash
feature/recruitment
```

---

## Member 3

Module Ownership:

- AI Service

Branch:

```bash
feature/ai
```

---

## Member 4

Module Ownership:

- Notifications
- Admin Dashboard
- Redis
- Docker
- Deployment

Branch:

```bash
feature/admin-devops
```

---

# Development Workflow

```text
Feature Branch
      ↓
Pull Request
      ↓
Code Review
      ↓
Develop Branch
      ↓
Testing
      ↓
Main Branch
      ↓
Deployment
```

Important Rules:

- Never push directly to main
- Never push directly to develop
- Always use feature branches
- Follow ownership boundaries
- Follow API contracts
- Follow database design

---

# AI Features

## Resume Parser

Extracts:

- Skills
- Education
- Projects
- Certifications

from uploaded resumes.

---

## Candidate Match Scoring

Compares:

Student Skills

vs

Job Requirements

Generates:

- Match Percentage
- Matched Skills
- Missing Skills

---

## Skill Gap Analysis

Provides:

- Missing Skills
- Learning Recommendations
- Career Guidance

---

# Backend Engineering Concepts Covered

This project covers:

- REST APIs
- Authentication
- Authorization
- CRUD Operations
- MongoDB Integration
- File Uploads
- Validation
- Error Handling
- Redis Caching
- Microservices
- Socket.IO
- Docker
- Deployment
- Testing
- Documentation

---

# Quick Start

## Clone Repository

```bash
git clone <repository-url>
```

---

## Install Frontend

```bash
cd frontend

npm install
```

---

## Install Backend

```bash
cd backend

npm install
```

---

## Install AI Service

```bash
cd ai-service

pip install -r requirements.txt
```

---

## Run Frontend

```bash
npm run dev
```

---

## Run Backend

```bash
npm run dev
```

---

## Run AI Service

```bash
uvicorn app.main:app --reload
```

---

# Environment Variables

Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
REDIS_URL=
AI_SERVICE_URL=
NODE_ENV=
```

Frontend

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

AI Service

```env
MODEL_NAME=
LOG_LEVEL=
```

---

# Development Rules

Before coding:

Read:

- PROJECT_OVERVIEW
- SYSTEM_ARCHITECTURE
- DATABASE_DESIGN
- API_CONTRACTS
- TEAM_OWNERSHIP
- AGENT_RULES

Mandatory:

- Follow coding standards
- Respect ownership boundaries
- Do not modify frozen contracts
- Do not modify database schema without approval

---

# Project Status

Current Phase:

Planning & Documentation Complete

Next Phase:

Milestone 1

Authentication & User Management

---

# License

Academic Project

Developed for Backend Engineering Course

---

# DevConnect

Building the bridge between student talent and recruiter opportunities.