# DevConnect

AI Service Specification

Version: 1.0

Status: AI Design Freeze

Service Type:
Independent AI Microservice

Framework:
FastAPI

Owner:
Member 3 (AI Engineering Lead)

---

# 1. Purpose

This document defines:

- AI Architecture
- AI Features
- Data Flow
- AI APIs
- AI Models
- AI Constraints
- Ownership Rules

This document serves as the single source of truth for the AI module.

---

# 2. AI Service Overview

The AI Service is a separate FastAPI application responsible for:

1. Resume Parsing
2. Candidate Matching
3. Skill Gap Analysis

The AI service operates independently from the main backend.

It communicates only through HTTP APIs.

---

# 3. Architecture

Frontend
    |
    |
Express Backend
    |
    |
FastAPI AI Service

---

Rules

Frontend cannot call AI directly.

Frontend must communicate through Express Backend.

All requests follow:

Frontend

↓

Express Backend

↓

FastAPI

↓

Express Backend

↓

Frontend

---

# 4. AI Features

Version 1.0 includes:

✓ Resume Parser

✓ Candidate Matching

✓ Skill Gap Analyzer

---

Version 2.0 (Not Included)

✗ AI Chatbot

✗ Interview Simulator

✗ Resume Generator

✗ Cover Letter Generator

✗ Voice Analysis

---

# 5. Resume Parser

Purpose

Automatically extract useful information from uploaded resumes.

---

Input

PDF Resume

---

Output

{
  "skills": [],
  "projects": [],
  "education": {},
  "certifications": []
}

---

Use Cases

Student uploads resume

↓

AI extracts data

↓

Student profile auto-populated

---

Benefits

Reduces manual data entry.

Improves onboarding experience.

---

# 6. Resume Parser Workflow

Step 1

Receive PDF

---

Step 2

Extract Text

Library:

pdfplumber

or

PyPDF2

---

Step 3

Normalize Text

Remove:

- Extra spaces
- Empty lines
- Special characters

---

Step 4

Skill Detection

Compare against:

skills_dictionary.json

---

Step 5

Education Detection

Extract:

College

Degree

Graduation Year

---

Step 6

Certification Detection

Extract certification names.

---

Step 7

Return Structured Response

---

# 7. Candidate Matching

Purpose

Calculate compatibility between student profiles and job requirements.

---

Input

Student Profile

Job Description

---

Output

{
  "matchScore": 87,
  "matchedSkills": [],
  "missingSkills": []
}

---

# 8. Candidate Matching Workflow

Step 1

Fetch Student Skills

---

Step 2

Fetch Job Required Skills

---

Step 3

Normalize Skills

Example

ReactJS

↓

React

---

Step 4

Calculate Matching

Formula

Match Score

=

Matched Skills

/

Required Skills

×

100

---

Example

Required Skills

React
Node
MongoDB
Docker

---

Student Skills

React
MongoDB
Python

---

Matched

React
MongoDB

---

Score

2 / 4 × 100

=

50%

---

# 9. Advanced Matching (Optional)

If time permits.

Use

Sentence Transformers

Model

all-MiniLM-L6-v2

---

Purpose

Detect related skills.

Example

Node.js

≈ Backend Development

React

≈ Frontend Development

---

Output

More intelligent matching.

---

# 10. Skill Gap Analyzer

Purpose

Show students what skills they need.

---

Input

Student Profile

Target Job

---

Output

{
  "missingSkills": [],
  "recommendations": []
}

---

Example

Target Role

Backend Developer

Required

Node.js
Express
MongoDB
Docker

---

Student Has

Node.js
MongoDB

---

Output

Missing

Express
Docker

---

Recommendations

Learn Express

Learn Docker

---

# 11. Recommendation Engine

Purpose

Provide actionable suggestions.

---

Example

Missing Skill

React

Recommendation

Complete React Course

Build React Project

---

Missing Skill

Docker

Recommendation

Learn Docker Basics

Deploy Project Using Docker

---

# 12. AI Service APIs

Base Route

/api/v1/ai

---

# Parse Resume

POST

/api/v1/ai/parse-resume

Authentication

Student

---

Request

multipart/form-data

resume

---

Response

{
  "success": true,
  "data": {
    "skills": [],
    "education": {},
    "projects": [],
    "certifications": []
  }
}

---

# Match Candidate

POST

/api/v1/ai/match-candidate

Authentication

Recruiter

---

Request

{
  "studentId": "",
  "jobId": ""
}

---

Response

{
  "success": true,
  "data": {
    "matchScore": 0,
    "matchedSkills": [],
    "missingSkills": []
  }
}

---

# Skill Gap Analysis

POST

/api/v1/ai/skill-gap

Authentication

Student

---

Request

{
  "targetRole": "Backend Developer"
}

---

Response

{
  "success": true,
  "data": {
    "missingSkills": [],
    "recommendations": []
  }
}

---

# 13. AI Folder Structure

ai-service/

├── app/
│
├── api/
│   ├── resume_parser.py
│   ├── candidate_matcher.py
│   └── skill_gap.py
│
├── services/
│   ├── resume_parser_service.py
│   ├── candidate_matching_service.py
│   └── skill_gap_service.py
│
├── utils/
│
├── models/
│
├── tests/
│
└── main.py

---

# 14. Libraries

FastAPI

Uvicorn

PyPDF2

pdfplumber

Sentence Transformers

scikit-learn

NumPy

Pandas

Pydantic

---

# 15. Performance Requirements

Resume Parsing

Target Time

< 3 seconds

---

Candidate Matching

Target Time

< 2 seconds

---

Skill Gap Analysis

Target Time

< 2 seconds

---

# 16. Security Rules

AI Service must not:

- Access MongoDB directly
- Access Redis directly
- Access frontend

---

AI Service receives only:

Required Input Data

through APIs.

---

# 17. Ownership Rules

Owner

Member 3

---

May Modify

ai-service/

---

May Not Modify

backend/

frontend/

database schemas

API contracts

---

# 18. Testing Requirements

Resume Parser Tests

Candidate Matching Tests

Skill Gap Tests

API Tests

Error Handling Tests

---

# 19. Future Scope

Version 2

- AI Interview Simulator
- Resume Quality Score
- Cover Letter Generator
- AI Career Advisor
- Coding Assessment Engine

Not included in Version 1.

---

# 20. AI Service Status

Status: APPROVED

Version: 1.0

AI Design State: FROZEN