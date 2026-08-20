# DevConnect

Entity Relationship Diagram Specification

Version: 1.0

Status: Database Relationship Freeze

---

# 1. Purpose

This document defines:

- System Entities
- Relationships
- Cardinality
- Ownership
- Database Interaction Flow

Reference:

docs/02_DATABASE_DESIGN.md

---

# 2. Main Entities

The system contains the following entities:

1. User
2. StudentProfile
3. RecruiterProfile
4. Job
5. Application
6. Notification
7. AIMatchResult
8. AuditLog

---

# 3. Entity Overview

+----------------+
|     User       |
+----------------+
        |
        |
        +----------------+
        |                |
        v                v

+----------------+  +------------------+
| StudentProfile |  | RecruiterProfile |
+----------------+  +------------------+

        |
        |
        v

+----------------+
| Application    |
+----------------+

        ^
        |
        |

+----------------+
| Job            |
+----------------+

---

# 4. User Entity

Collection

users

---

Primary Key

_id

---

Relationships

User
1
→
1
StudentProfile

---

User
1
→
1
RecruiterProfile

---

User
1
→
Many
Notifications

---

User
1
→
Many
AuditLogs

---

# 5. Student Profile Entity

Collection

student_profiles

---

Primary Key

_id

---

Foreign Key Reference

userId

---

Relationships

StudentProfile

1

→

Many Applications

---

StudentProfile

1

→

Many AIMatchResults

---

# 6. Recruiter Profile Entity

Collection

recruiter_profiles

---

Primary Key

_id

---

Foreign Key

userId

---

Relationships

RecruiterProfile

1

→

Many Jobs

---

# 7. Job Entity

Collection

jobs

---

Primary Key

_id

---

Foreign Key

recruiterId

---

Relationships

Job

1

→

Many Applications

---

Job

1

→

Many AIMatchResults

---

# 8. Application Entity

Collection

applications

---

Primary Key

_id

---

References

studentId

jobId

---

Relationships

Application

Many

→

1 Student

---

Application

Many

→

1 Job

---

Status Values

Applied

Under Review

Shortlisted

Rejected

Selected

---

# 9. Notification Entity

Collection

notifications

---

Primary Key

_id

---

References

userId

---

Relationships

User

1

→

Many Notifications

---

Notification Types

Application Submitted

Shortlisted

Rejected

Selected

Job Posted

---

# 10. AI Match Result Entity

Collection

ai_match_results

---

Primary Key

_id

---

References

studentId

jobId

---

Relationships

Student

1

→

Many Match Results

---

Job

1

→

Many Match Results

---

Stored Data

Match Score

Matched Skills

Missing Skills

Recommendations

---

# 11. Audit Log Entity

Collection

audit_logs

---

Primary Key

_id

---

References

userId

---

Relationships

User

1

→

Many Audit Logs

---

Purpose

Track important actions.

Examples

User Login

Profile Update

Job Creation

Application Submission

---

# 12. Cardinality Summary

User

1 → 1 StudentProfile

---

User

1 → 1 RecruiterProfile

---

RecruiterProfile

1 → Many Jobs

---

StudentProfile

1 → Many Applications

---

Job

1 → Many Applications

---

StudentProfile

1 → Many AIMatchResults

---

Job

1 → Many AIMatchResults

---

User

1 → Many Notifications

---

User

1 → Many AuditLogs

---

# 13. ER Diagram (Text Representation)

                        +----------------+
                        |     USER       |
                        +----------------+
                               |
               +---------------+---------------+
               |                               |
               v                               v

+-------------------------+      +-------------------------+
|    STUDENT_PROFILE      |      |   RECRUITER_PROFILE     |
+-------------------------+      +-------------------------+
               |                               |
               |                               |
               v                               v

      +----------------+              +----------------+
      | APPLICATIONS   |<------------>|      JOBS      |
      +----------------+              +----------------+
               |
               |
               v

      +----------------+
      | NOTIFICATIONS  |
      +----------------+

               |

               v

      +----------------+
      | AI_MATCH_RESULT|
      +----------------+

               |

               v

      +----------------+
      | AUDIT_LOGS     |
      +----------------+

---

# 14. Database Ownership Mapping

Users

Member 1

---

Student Profiles

Member 1

---

Recruiter Profiles

Member 2

---

Jobs

Member 2

---

Applications

Member 2

---

AI Match Results

Member 3

---

Notifications

Member 4

---

Audit Logs

Member 4

---

# 15. Design Constraints

No Circular References

---

No Embedded Large Documents

---

Use ObjectId References

---

Maintain Ownership Rules

---

Follow Database Design Document

---

# 16. Status

Status: APPROVED

Version: 1.0

Relationship State: FROZEN