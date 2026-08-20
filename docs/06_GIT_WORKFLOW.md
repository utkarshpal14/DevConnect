# DevConnect

Git Workflow Document

Version: 1.0

Status: Workflow Freeze

---

# 1. Purpose

This document defines:

- Branch Strategy
- Commit Standards
- Pull Request Process
- Merge Process
- Conflict Resolution Process
- Release Process
- AI Agent Git Rules

All team members must follow this workflow.

---

# 2. Git Philosophy

Goals:

- Prevent merge conflicts
- Keep history clean
- Enable parallel development
- Support AI-agent-assisted development
- Ensure code stability

Rules:

- Never push directly to main
- Never merge your own PR
- Never work directly on develop
- Always use feature branches

---

# 3. Branch Structure

Repository Branches

main

develop

feature/auth

feature/recruitment

feature/ai

feature/admin-devops

---

# 4. Branch Purpose

main

Purpose:

Production-ready code

Rules:

- Protected Branch
- Direct pushes prohibited
- Only merged from develop

---

develop

Purpose:

Integration branch

Rules:

- All completed features merge here first
- Used for testing
- Protected branch

---

feature/auth

Owner:

Member 1

Purpose:

Authentication & User Module

---

feature/recruitment

Owner:

Member 2

Purpose:

Recruiter, Jobs & Applications

---

feature/ai

Owner:

Member 3

Purpose:

FastAPI & AI Features

---

feature/admin-devops

Owner:

Member 4

Purpose:

Admin, Notifications, Redis, Docker

---

# 5. Initial Repository Setup

After creating repository:

Create branches:

main

develop

feature/auth

feature/recruitment

feature/ai

feature/admin-devops

---

Protect:

main

develop

---

Enable:

Require Pull Request

Require Reviews

Prevent Direct Push

---

# 6. Daily Development Workflow

Step 1

Pull Latest Changes

git checkout develop

git pull origin develop

---

Step 2

Switch To Feature Branch

git checkout feature/auth

---

Step 3

Sync Feature Branch

git merge develop

---

Step 4

Implement Changes

---

Step 5

Commit Changes

git add .

git commit -m "feat: add login api"

---

Step 6

Push Changes

git push origin feature/auth

---

Step 7

Create Pull Request

feature/auth

↓

develop

---

# 7. Commit Message Standard

Format

type: description

---

Examples

feat: add register api

feat: implement job search

fix: resolve jwt validation bug

docs: update roadmap

refactor: optimize recruiter service

test: add auth tests

chore: update dependencies

---

Allowed Types

feat

fix

docs

refactor

test

chore

---

# 8. Pull Request Workflow

Feature Branch

↓

Pull Request

↓

Code Review

↓

Approval

↓

Merge Into Develop

---

# 9. Pull Request Template

Title

[Module] Description

Example

[Auth] Add JWT Middleware

---

Description

## Purpose

Brief explanation

---

## Files Changed

List files

---

## Testing

Testing evidence

---

## Checklist

✓ Build passes

✓ Tests pass

✓ Documentation updated

---

# 10. Code Review Rules

PR cannot be merged until:

✓ Documentation follows standards

✓ API contract respected

✓ Database schema respected

✓ Folder structure respected

✓ Tests completed

✓ No conflicts

---

# 11. Merge Rules

Allowed

Feature Branch

↓

Develop

---

Allowed

Develop

↓

Main

---

Not Allowed

Feature Branch

↓

Main

---

Not Allowed

Direct Push

↓

Main

---

# 12. Conflict Prevention Strategy

Rule 1

Module Ownership

Only assigned owner edits module.

---

Rule 2

Database Freeze

No schema modifications.

---

Rule 3

API Freeze

No API contract changes.

---

Rule 4

Folder Freeze

No folder changes.

---

Rule 5

Documentation First

Update docs before major changes.

---

# 13. Conflict Resolution Process

When conflict occurs:

Step 1

Pull latest develop

---

Step 2

Identify conflicting files

---

Step 3

Discuss with owner

---

Step 4

Resolve manually

---

Step 5

Retest functionality

---

Step 6

Push updated branch

---

# 14. Emergency Hotfix Process

If critical bug exists:

Create

hotfix/issue-name

Example

hotfix/jwt-bug

---

Fix issue

↓

Review

↓

Merge into develop

↓

Merge into main

---

# 15. Release Workflow

Feature Branches

↓

Develop

↓

Testing

↓

Release Candidate

↓

Main

---

# 16. Weekly Integration Process

Every Saturday

All Members:

Pull Latest Develop

Run Project

Test Modules

Report Issues

Resolve Integration Bugs

---

# 17. AI Agent Git Rules

Before coding:

Read

00_PROJECT_OVERVIEW.md

01_SYSTEM_ARCHITECTURE.md

02_DATABASE_DESIGN.md

03_API_CONTRACTS.md

07_TEAM_OWNERSHIP.md

---

Agents may NOT:

Create branches

Delete branches

Force push

Modify schemas

Modify APIs

Modify ownership

---

Agents may only edit:

Files inside assigned modules

---

# 18. GitHub Labels

Use labels:

bug

feature

documentation

enhancement

testing

ai-module

backend

frontend

devops

---

# 19. GitHub Issues Workflow

Every task should be:

Issue

↓

Assigned Member

↓

Feature Branch Work

↓

Pull Request

↓

Review

↓

Merge

---

# 20. Definition of Done

A task is complete only if:

✓ Code Written

✓ Tested

✓ Reviewed

✓ Documentation Updated

✓ Merged Into Develop

---

# 21. Repository Rules

Never commit:

.env

node_modules

__pycache__

dist

build

coverage

---

Always commit:

Source Code

Documentation

Configuration Files

---

# 22. Release Checklist

Before merging develop into main:

✓ Authentication Tested

✓ Recruitment Tested

✓ AI Tested

✓ Notifications Tested

✓ Admin Tested

✓ Docker Tested

✓ Deployment Tested

✓ Documentation Updated

---

# 23. Workflow Status

Status: APPROVED

Version: 1.0

Workflow State: FROZEN

All contributors must follow this workflow.