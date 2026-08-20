# DevConnect

Database Design Document

Version: 1.0

Status: Schema Freeze

Database: MongoDB Atlas

ODM: Mongoose

---

# 1. Purpose

This document defines:

- Collections
- Fields
- Relationships
- Data Types
- Indexes
- Constraints

This document acts as the single source of truth for database structure.

---

# 2. Schema Freeze Policy

IMPORTANT

After approval:

Developers and AI Agents may NOT:

- Rename fields
- Delete fields
- Change field types
- Change relationships

without team approval.

All modules must follow this document.

---

# 3. Collection Overview

The system contains:

1. users
2. student_profiles
3. recruiter_profiles
4. jobs
5. applications
6. notifications
7. ai_match_results
8. audit_logs

---

# 4. Users Collection

Collection Name:

users

Purpose:

Stores authentication and role information.

---

Schema

{
  _id: ObjectId,

  fullName: String,

  email: String,

  passwordHash: String,

  role: String,

  isActive: Boolean,

  createdAt: Date,

  updatedAt: Date
}

---

Field Details

_id

Type:
ObjectId

Required:
Yes

Unique:
Yes

---

fullName

Type:
String

Required:
Yes

Max Length:
100

---

email

Type:
String

Required:
Yes

Unique:
Yes

Indexed:
Yes

---

passwordHash

Type:
String

Required:
Yes

---

role

Type:
String

Allowed Values:

student
recruiter
admin

Required:
Yes

Indexed:
Yes

---

isActive

Type:
Boolean

Default:
true

---

createdAt

Type:
Date

Default:
Current Timestamp

---

updatedAt

Type:
Date

Auto Updated

---

# 5. Student Profiles Collection

Collection:

student_profiles

Purpose:

Stores detailed student information.

---

Schema

{
  _id: ObjectId,

  userId: ObjectId,

  headline: String,

  bio: String,

  profileImageUrl: String,

  resumeUrl: String,

  githubUrl: String,

  linkedinUrl: String,

  portfolioUrl: String,

  skills: [String],

  certifications: [Certification],

  projects: [Project],

  achievements: [Achievement],

  education: Education,

  createdAt: Date,

  updatedAt: Date
}

---

Relationship

student_profiles.userId

references

users._id

One User

→ One Student Profile

---

# 6. Embedded Object

Certification

{
  title: String,

  issuer: String,

  issueDate: Date,

  certificateUrl: String
}

---

# 7. Embedded Object

Project

{
  title: String,

  description: String,

  techStack: [String],

  githubUrl: String,

  liveUrl: String
}

---

# 8. Embedded Object

Achievement

{
  title: String,

  description: String,

  achievementDate: Date
}

---

# 9. Embedded Object

Education

{
  institution: String,

  degree: String,

  branch: String,

  cgpa: Number,

  graduationYear: Number
}

---

# 10. Recruiter Profiles Collection

Collection:

recruiter_profiles

Purpose:

Stores company and recruiter details.

---

Schema

{
  _id: ObjectId,

  userId: ObjectId,

  companyName: String,

  companyWebsite: String,

  companyDescription: String,

  companyLogoUrl: String,

  location: String,

  createdAt: Date,

  updatedAt: Date
}

---

Relationship

recruiter_profiles.userId

references

users._id

---

# 11. Jobs Collection

Collection:

jobs

Purpose:

Stores job and internship postings.

---

Schema

{
  _id: ObjectId,

  recruiterId: ObjectId,

  title: String,

  description: String,

  employmentType: String,

  location: String,

  requiredSkills: [String],

  experienceLevel: String,

  salaryRange: String,

  applicationDeadline: Date,

  status: String,

  createdAt: Date,

  updatedAt: Date
}

---

employmentType

Allowed Values

Internship

Full-Time

Part-Time

Contract

---

status

Allowed Values

Open

Closed

Draft

---

Relationship

jobs.recruiterId

references

recruiter_profiles._id

---

# 12. Applications Collection

Collection:

applications

Purpose:

Stores job applications.

---

Schema

{
  _id: ObjectId,

  studentId: ObjectId,

  jobId: ObjectId,

  status: String,

  appliedAt: Date,

  updatedAt: Date
}

---

status

Allowed Values

Applied

Under Review

Shortlisted

Rejected

Selected

Withdrawn

---

Relationship

studentId

references

student_profiles._id

---

jobId

references

jobs._id

---

Constraint

One Student

Can Apply

Only Once

Per Job

Unique Compound Index

(studentId, jobId)

---

# 13. Notifications Collection

Collection:

notifications

Purpose:

Stores system notifications.

---

Schema

{
  _id: ObjectId,

  userId: ObjectId,

  title: String,

  message: String,

  isRead: Boolean,

  createdAt: Date
}

---

Relationship

notifications.userId

references

users._id

---

# 14. AI Match Results Collection

Collection:

ai_match_results

Purpose:

Stores candidate-job matching scores.

---

Schema

{
  _id: ObjectId,

  studentId: ObjectId,

  jobId: ObjectId,

  matchScore: Number,

  matchedSkills: [String],

  missingSkills: [String],

  generatedAt: Date
}

---

Relationship

studentId

references

student_profiles._id

jobId

references

jobs._id

---

# 15. Audit Logs Collection

Collection:

audit_logs

Purpose:

Track important system actions.

---

Schema

{
  _id: ObjectId,

  actorId: ObjectId,

  action: String,

  entityType: String,

  entityId: ObjectId,

  createdAt: Date
}

---

Examples

User Registered

Job Created

Candidate Shortlisted

Resume Uploaded

---

# 16. Indexing Strategy

Indexes

users.email

Unique

---

users.role

Normal Index

---

jobs.status

Index

---

jobs.requiredSkills

Multikey Index

---

applications.studentId

Index

---

applications.jobId

Index

---

notifications.userId

Index

---

# 17. Data Ownership

Authentication Module

Owns:

users

---

Portfolio Module

Owns:

student_profiles

---

Recruitment Module

Owns:

jobs

applications

---

Notification Module

Owns:

notifications

---

AI Module

Owns:

ai_match_results

---

Admin Module

Owns:

audit_logs

---

# 18. Collection Access Rules

AI Service

READ ONLY

student_profiles

jobs

---

AI Service

CANNOT

Directly Access MongoDB

Must receive data from Backend APIs.

---

Frontend

Cannot Access Database.

Only Backend Can Access MongoDB.

---

# 19. Future Version Fields

NOT INCLUDED IN V1

Bookmarks

Messaging

Interviews

Video Profiles

Referral System

These require Version 2 approval.

---

# 20. Database Status

Status: APPROVED

Version: 1.0

Schema State: FROZEN

All development must follow this schema.