# DevConnect

Software Requirements Specification (SRS)

Version: 1.0

Status: Approved

Prepared By:
DevConnect Team

---

# 1. Introduction

## 1.1 Project Title

DevConnect

Developer Portfolio & Campus Recruitment Portal

---

## 1.2 Purpose

DevConnect is a full-stack web platform designed to bridge the gap between students and recruiters.

The platform enables students to create professional developer portfolios while allowing recruiters to discover talent, post jobs, and manage recruitment activities.

Additionally, AI-powered features help students improve employability and help recruiters identify suitable candidates efficiently.

---

## 1.3 Scope

The system provides:

- Student Portfolio Management
- Recruiter Management
- Job & Internship Posting
- Application Tracking
- Resume Uploading
- AI Resume Parsing
- AI Candidate Matching
- AI Skill Gap Analysis
- Real-Time Notifications
- Admin Monitoring

The system is intended primarily for:

- College Students
- Campus Recruiters
- Placement Cells
- Academic Institutions

---

# 2. Overall Description

## 2.1 Product Perspective

DevConnect is a standalone web-based platform.

The system consists of:

Frontend (React)

↓

Backend API (Node.js + Express)

↓

Database (MongoDB)

↓

AI Service (FastAPI)

↓

Redis Cache

---

## 2.2 Product Functions

Major functions include:

### Student Features

- Register Account
- Login
- Create Profile
- Upload Resume
- Add Projects
- Add Skills
- Add Certifications
- Browse Jobs
- Apply for Jobs
- Track Applications
- View AI Recommendations

---

### Recruiter Features

- Register Recruiter Account
- Create Company Profile
- Post Jobs
- Manage Jobs
- Search Candidates
- Review Applications
- Shortlist Candidates
- Reject Candidates

---

### Admin Features

- Manage Users
- Manage Recruiters
- Monitor Jobs
- Monitor Applications
- View Platform Statistics

---

### AI Features

- Resume Parsing
- Candidate Match Scoring
- Skill Gap Analysis

---

## 2.3 User Classes

### Student

Primary user of the platform.

Uses portfolio and recruitment features.

---

### Recruiter

Creates job opportunities and reviews applicants.

---

### Admin

Maintains platform operations.

---

# 3. System Features

## 3.1 User Registration

Description:

Allows users to create accounts.

Inputs:

- Name
- Email
- Password
- Role

Outputs:

- User Account

Priority:

High

---

## 3.2 User Authentication

Description:

Allows secure login using JWT authentication.

Priority:

High

---

## 3.3 Student Profile Management

Description:

Students can create professional portfolios.

Data Includes:

- Skills
- Projects
- Certifications
- Resume
- Links

Priority:

High

---

## 3.4 Resume Upload

Description:

Students upload resumes.

Priority:

High

---

## 3.5 AI Resume Parsing

Description:

Extract information automatically from uploaded resumes.

Outputs:

- Skills
- Education
- Certifications
- Projects

Priority:

Medium

---

## 3.6 Job Posting

Description:

Recruiters create internships and jobs.

Priority:

High

---

## 3.7 Job Search

Description:

Students search and filter opportunities.

Priority:

High

---

## 3.8 Job Application

Description:

Students apply for jobs.

Priority:

High

---

## 3.9 Application Tracking

Description:

Students monitor application status.

Statuses:

- Applied
- Under Review
- Shortlisted
- Rejected
- Selected

Priority:

High

---

## 3.10 Candidate Matching

Description:

AI calculates compatibility between student profile and job requirements.

Priority:

Medium

---

## 3.11 Skill Gap Analysis

Description:

AI identifies missing skills and suggests improvements.

Priority:

Medium

---

## 3.12 Notification System

Description:

Real-time updates using Socket.IO.

Priority:

Medium

---

## 3.13 Admin Dashboard

Description:

Platform monitoring and management.

Priority:

Medium

---

# 4. External Interface Requirements

## 4.1 User Interface

Responsive web application.

Supported Devices:

- Desktop
- Laptop
- Tablet
- Mobile

---

## 4.2 Software Interfaces

### Frontend

React

---

### Backend

Node.js

Express.js

---

### Database

MongoDB Atlas

---

### AI Service

FastAPI

---

### Cache

Redis

---

## 4.3 Communication Interfaces

HTTP/HTTPS

REST APIs

WebSockets

---

# 5. Functional Requirements

## FR-01

The system shall allow users to register.

---

## FR-02

The system shall allow users to login.

---

## FR-03

The system shall support role-based access control.

---

## FR-04

The system shall allow students to manage profiles.

---

## FR-05

The system shall allow students to upload resumes.

---

## FR-06

The system shall allow recruiters to create jobs.

---

## FR-07

The system shall allow recruiters to update jobs.

---

## FR-08

The system shall allow recruiters to delete jobs.

---

## FR-09

The system shall allow students to browse jobs.

---

## FR-10

The system shall allow students to apply for jobs.

---

## FR-11

The system shall allow recruiters to manage applications.

---

## FR-12

The system shall generate AI match scores.

---

## FR-13

The system shall perform skill gap analysis.

---

## FR-14

The system shall provide notifications.

---

## FR-15

The system shall provide administrative controls.

---

# 6. Non-Functional Requirements

## NFR-01 Performance

API response time:

< 2 seconds

---

## NFR-02 Scalability

Support:

1000+ users

---

## NFR-03 Availability

Target:

99% uptime

---

## NFR-04 Security

Requirements:

- JWT Authentication
- Password Hashing
- Input Validation
- Authorization Checks

---

## NFR-05 Reliability

Data consistency must be maintained.

---

## NFR-06 Maintainability

Code must follow modular architecture.

---

## NFR-07 Usability

Interface should be intuitive and responsive.

---

# 7. Constraints

Technology Constraints

- React
- Node.js
- Express.js
- MongoDB
- FastAPI
- Redis

---

Deployment Constraints

- Cloud Hosting
- Docker Containers

---

Academic Constraints

- Backend Engineering syllabus compliance
- REST API architecture
- Database integration
- Authentication
- Deployment

---

# 8. Assumptions

- Users have internet access.
- Recruiters provide accurate job information.
- Students maintain updated profiles.
- AI recommendations are advisory.

---

# 9. Use Case Summary

Student

- Register
- Login
- Create Profile
- Upload Resume
- Apply Job
- View Applications
- View AI Suggestions

---

Recruiter

- Login
- Create Jobs
- Manage Jobs
- View Applicants
- Update Status

---

Admin

- Monitor Platform
- Manage Users
- View Statistics

---

# 10. Success Criteria

Project will be considered successful if:

- Students can create portfolios.
- Recruiters can recruit candidates.
- AI features operate correctly.
- Notifications function correctly.
- Platform is deployed successfully.

---

# 11. Future Enhancements

- AI Interview Simulator
- Resume Scoring
- Cover Letter Generator
- Coding Assessment Engine
- Placement Analytics Dashboard

---

# 12. Approval

Status: APPROVED

Version: 1.0

Document State: FROZEN