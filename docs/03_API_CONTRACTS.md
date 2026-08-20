# DevConnect

API Contracts Document

Version: 1.0

Status: API Freeze

Base URL:

/api/v1

---

# 1. Purpose

This document defines:

- Endpoint URLs
- HTTP Methods
- Request Bodies
- Response Bodies
- Authentication Rules
- Authorization Rules
- Ownership

All modules must follow these contracts.

---

# 2. Standard Response Format

Success Response

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

---

Error Response

{
  "success": false,
  "message": "Error message"
}

---

# 3. Authentication APIs

Module Owner:
Authentication Team

Base Route:

/api/v1/auth

---

## Register User

POST

/api/v1/auth/register

Authentication:
Not Required

Request

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "student"
}

Response

{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "..."
  }
}

---

## Login User

POST

/api/v1/auth/login

Authentication:
Not Required

Request

{
  "email": "john@example.com",
  "password": "Password123"
}

Response

{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {}
  }
}

---

## Get Current User

GET

/api/v1/auth/me

Authentication:
Required

Response

{
  "success": true,
  "data": {
    "user": {}
  }
}

---

# 4. Student Profile APIs

Owner:
Portfolio Team

Base Route

/api/v1/students

---

## Create Profile

POST

/api/v1/students/profile

Authentication:
Student

Request

{
  "headline": "",
  "bio": "",
  "githubUrl": "",
  "linkedinUrl": "",
  "portfolioUrl": ""
}

Response

{
  "success": true,
  "data": {}
}

---

## Get My Profile

GET

/api/v1/students/profile

Authentication:
Student

---

## Update Profile

PUT

/api/v1/students/profile

Authentication:
Student

---

## Upload Resume

POST

/api/v1/students/resume

Authentication:
Student

Content-Type

multipart/form-data

Field

resume

Response

{
  "success": true,
  "resumeUrl": ""
}

---

## Add Skill

POST

/api/v1/students/skills

Authentication:
Student

Request

{
  "skill": "React"
}

---

## Delete Skill

DELETE

/api/v1/students/skills/:skillId

Authentication:
Student

---

## Add Project

POST

/api/v1/students/projects

Authentication:
Student

Request

{
  "title": "",
  "description": "",
  "techStack": []
}

---

## Update Project

PUT

/api/v1/students/projects/:projectId

Authentication:
Student

---

## Delete Project

DELETE

/api/v1/students/projects/:projectId

Authentication:
Student

---

# 5. Recruiter APIs

Owner:
Recruitment Team

Base Route

/api/v1/recruiters

---

## Create Recruiter Profile

POST

/api/v1/recruiters/profile

Authentication:
Recruiter

---

## Get Recruiter Profile

GET

/api/v1/recruiters/profile

Authentication:
Recruiter

---

## Update Recruiter Profile

PUT

/api/v1/recruiters/profile

Authentication:
Recruiter

---

# 6. Job APIs

Owner:
Recruitment Team

Base Route

/api/v1/jobs

---

## Create Job

POST

/api/v1/jobs

Authentication:
Recruiter

Request

{
  "title": "",
  "description": "",
  "requiredSkills": [],
  "location": "",
  "employmentType": "",
  "salaryRange": ""
}

Response

{
  "success": true,
  "data": {}
}

---

## Get All Jobs

GET

/api/v1/jobs

Authentication:
Optional

Query Parameters

?page=1

&limit=10

&search=react

&location=remote

&employmentType=internship

---

## Get Single Job

GET

/api/v1/jobs/:jobId

Authentication:
Optional

---

## Update Job

PUT

/api/v1/jobs/:jobId

Authentication:
Recruiter

---

## Delete Job

DELETE

/api/v1/jobs/:jobId

Authentication:
Recruiter

---

## Close Job

PATCH

/api/v1/jobs/:jobId/close

Authentication:
Recruiter

---

# 7. Application APIs

Owner:
Recruitment Team

Base Route

/api/v1/applications

---

## Apply For Job

POST

/api/v1/applications

Authentication:
Student

Request

{
  "jobId": ""
}

Response

{
  "success": true,
  "message": "Application submitted"
}

---

## Withdraw Application

PATCH

/api/v1/applications/:applicationId/withdraw

Authentication:
Student

---

## Get My Applications

GET

/api/v1/applications/my

Authentication:
Student

---

## Get Job Applicants

GET

/api/v1/applications/job/:jobId

Authentication:
Recruiter

---

## Update Application Status

PATCH

/api/v1/applications/:applicationId/status

Authentication:
Recruiter

Request

{
  "status": "Shortlisted"
}

Allowed Values

Applied
Under Review
Shortlisted
Rejected
Selected

---

# 8. Notification APIs

Owner:
Admin/Realtime Team

Base Route

/api/v1/notifications

---

## Get Notifications

GET

/api/v1/notifications

Authentication:
Required

---

## Mark Notification As Read

PATCH

/api/v1/notifications/:notificationId/read

Authentication:
Required

---

# 9. AI APIs

Owner:
AI Team

Base Route

/api/v1/ai

---

## Parse Resume

POST

/api/v1/ai/parse-resume

Authentication:
Student

Request

multipart/form-data

resume

Response

{
  "success": true,
  "data": {
    "skills": [],
    "projects": [],
    "education": {}
  }
}

---

## Candidate Match Score

POST

/api/v1/ai/match-candidate

Authentication:
Recruiter

Request

{
  "studentId": "",
  "jobId": ""
}

Response

{
  "success": true,
  "data": {
    "matchScore": 87,
    "matchedSkills": [],
    "missingSkills": []
  }
}

---

## Skill Gap Analysis

POST

/api/v1/ai/skill-gap

Authentication:
Student

Request

{
  "targetRole": "Backend Developer"
}

Response

{
  "success": true,
  "data": {
    "missingSkills": [],
    "recommendations": []
  }
}

---

# 10. Admin APIs

Owner:
Admin Team

Base Route

/api/v1/admin

---

## Get Dashboard Statistics

GET

/api/v1/admin/dashboard

Authentication:
Admin

Response

{
  "success": true,
  "data": {
    "totalUsers": 0,
    "totalStudents": 0,
    "totalRecruiters": 0,
    "totalJobs": 0,
    "totalApplications": 0
  }
}

---

## Get All Users

GET

/api/v1/admin/users

Authentication:
Admin

---

## Disable User

PATCH

/api/v1/admin/users/:userId/disable

Authentication:
Admin

---

## Enable User

PATCH

/api/v1/admin/users/:userId/enable

Authentication:
Admin

---

# 11. WebSocket Events

Owner:
Realtime Team

---

Event

application_submitted

Payload

{
  "studentId": "",
  "jobId": ""
}

---

Event

candidate_shortlisted

Payload

{
  "applicationId": ""
}

---

Event

candidate_rejected

Payload

{
  "applicationId": ""
}

---

Event

job_created

Payload

{
  "jobId": ""
}

---

# 12. Authorization Matrix

Student

Can:

- Manage own profile
- Apply jobs
- View own applications
- Use AI features

Cannot:

- Create jobs
- Access admin APIs

---

Recruiter

Can:

- Create jobs
- Manage jobs
- View applicants
- Update application status
- Use matching AI

Cannot:

- Access admin APIs

---

Admin

Can:

- Access everything
- Manage platform

---

# 13. API Freeze Rules

After approval:

Developers and AI Agents may NOT:

- Rename endpoints
- Change request structure
- Change response structure
- Change authentication requirements

without approval.

---

# 14. API Status

Status: APPROVED

Version: 1.0

API State: FROZEN