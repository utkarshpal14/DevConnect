# DevConnect

System Architecture Document

Version: 1.0

Status: Architecture Freeze

---

# 1. Purpose

This document defines the complete architecture of DevConnect.

All development decisions must follow this architecture.

No developer or AI agent may introduce new services, databases, or communication patterns without team approval.

This architecture serves as the single source of truth for system design.

---

# 2. Architectural Style

DevConnect follows a Modular Monolith + AI Microservice Architecture.

The system consists of:

1. Frontend Application
2. Backend API Server
3. Database Layer
4. Cache Layer
5. Realtime Communication Layer
6. AI Service
7. External Services

---

# 3. High Level Architecture

+---------------------+
| React Frontend      |
+----------+----------+
           |
           |
           v
+---------------------+
| Express Backend     |
+----------+----------+
           |
    +------+------+------+
    |             |      |
    v             v      v

+--------+   +--------+   +--------+
|MongoDB |   | Redis  |   |SocketIO|
+--------+   +--------+   +--------+

           |
           v

+----------------------+
| FastAPI AI Service   |
+----------------------+

---

# 4. Architecture Principles

The project follows these principles:

## Separation of Concerns

Frontend:
- UI
- State Management
- API Consumption

Backend:
- Business Logic
- Authentication
- Authorization
- Data Processing

Database:
- Data Storage Only

AI Service:
- AI Computation Only

---

## Modular Design

Every module must be independent.

Examples:

Authentication Module

MUST NOT contain:

- Job Logic
- AI Logic
- Notification Logic

Job Module

MUST NOT contain:

- Authentication Logic
- AI Logic

AI Service

MUST NOT access frontend code.

---

## API First Development

All communication happens through APIs.

No module directly accesses another module's files.

Communication Rules:

Frontend → Backend

Backend → Database

Backend → Redis

Backend → AI Service

Backend → Socket.IO

Allowed.

Any other communication is prohibited.

---

# 5. Frontend Architecture

Technology:

- React
- Vite
- TailwindCSS
- Axios
- React Router

---

## Frontend Responsibilities

The frontend is responsible for:

- User Interface
- Routing
- Forms
- API Calls
- Authentication State
- Notifications Display

---

## Frontend Must NOT

- Access Database
- Execute AI Logic
- Store Sensitive Secrets
- Implement Business Logic

---

# 6. Backend Architecture

Technology:

- Node.js
- Express.js

---

Backend Responsibilities:

- Authentication
- Authorization
- Business Logic
- Validation
- Database Operations
- File Uploads
- API Responses
- Socket Events
- AI Integration

---

## Backend Modules

The backend contains:

Authentication Module

User Module

Student Profile Module

Recruiter Module

Job Module

Application Module

Notification Module

Admin Module

Cache Module

Integration Module

---

# 7. AI Service Architecture

Technology:

- Python
- FastAPI

Purpose:

Provide AI functionality independently from the backend.

---

## AI Services

Resume Parser

Candidate Matcher

Skill Gap Analyzer

---

## Communication

Backend sends:

POST requests

to

FastAPI Service

Example:

Backend

POST

/api/ai/match

↓

FastAPI

Returns Match Score

---

## AI Service Rules

AI Service:

Must NOT

- Access MongoDB directly
- Access Redis directly
- Modify Backend Database

All database interactions must happen through Express Backend.

---

# 8. Database Architecture

Technology:

MongoDB Atlas

ODM:

Mongoose

---

## Database Responsibilities

Store:

Users

Profiles

Jobs

Applications

Notifications

Analytics

---

## Database Rules

No frontend component may access MongoDB.

Only Express Backend may access MongoDB.

AI Service cannot directly query MongoDB.

---

# 9. Cache Architecture

Technology:

Redis

Purpose:

Reduce database load.

---

## Cache Usage

Cache:

Job Listings

Popular Searches

Candidate Search Results

Dashboard Statistics

---

## Cache Rules

Redis is temporary storage.

MongoDB remains source of truth.

---

# 10. Realtime Architecture

Technology:

Socket.IO

---

Purpose

Real-time notifications.

---

Supported Events

Application Submitted

Application Withdrawn

Candidate Shortlisted

Candidate Rejected

New Job Posted

---

## Communication Flow

Recruiter Action

↓

Backend

↓

Socket.IO Event

↓

Student Client

---

# 11. File Upload Architecture

Technology:

Multer

---

Supported Files

Resume PDF

Profile Image

---

Upload Flow

Frontend

↓

Backend

↓

File Storage

↓

URL Saved in MongoDB

---

# 12. External Services

GitHub API

Purpose:

Fetch public repositories.

---

Future Integrations

LinkedIn

LeetCode

HackerRank

Not included in Version 1.0.

---

# 13. Security Architecture

Authentication:

JWT

Password Storage:

bcrypt

---

Protected Resources

Student Dashboard

Recruiter Dashboard

Admin Dashboard

Job Management

Application Management

---

Authorization Levels

Student

Recruiter

Admin

---

# 14. Error Handling Strategy

Every API returns:

Success Response

or

Error Response

---

Standard Format

Success

{
  "success": true,
  "data": {}
}

Error

{
  "success": false,
  "message": "Error Message"
}

---

# 15. Logging Strategy

Development:

Console Logs

Production:

Centralized Logger

Future Scope

Winston

Morgan

---

# 16. Scalability Strategy

Future Scaling Options

Separate:

Auth Service

Recruitment Service

Notification Service

AI Service

into independent microservices.

Version 1.0 remains Modular Monolith.

---

# 17. Architecture Freeze Rules

After approval:

Developers and AI Agents may NOT:

- Introduce new databases
- Introduce new backend frameworks
- Change communication flow
- Change service responsibilities
- Create direct frontend-database connections
- Create direct AI-database connections

without team approval.

---

# 18. Approved Technology Stack

Frontend

- React
- Vite
- TailwindCSS

Backend

- Node.js
- Express.js

Database

- MongoDB Atlas

Authentication

- JWT
- bcrypt

AI

- FastAPI
- Sentence Transformers
- Scikit-learn

Realtime

- Socket.IO

Cache

- Redis

Documentation

- Swagger

Deployment

- Docker
- Render
- Vercel

---

# 19. Architecture Status

Status: APPROVED

Version: 1.0

This architecture is frozen until Version 2.0 planning begins.