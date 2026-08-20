# DevConnect

Deployment Plan

Version: 1.0

Status: Deployment Freeze

---

# 1. Purpose

This document defines:

- Infrastructure Architecture
- Deployment Strategy
- Cloud Services
- Environment Variables
- Docker Configuration
- CI/CD Workflow
- Production Setup

This serves as the official deployment guide for DevConnect.

---

# 2. Deployment Architecture

Production Architecture

Users

↓

Frontend (Vercel)

↓

Backend API (Render)

↓

MongoDB Atlas

↓

Redis Cloud

↓

AI Service (Render)

---

Architecture Diagram

+----------------------+
|      Users           |
+----------+-----------+
           |
           v
+----------------------+
| Frontend (Vercel)    |
| React + Vite         |
+----------+-----------+
           |
           v
+----------------------+
| Backend (Render)     |
| Node.js + Express    |
+----------+-----------+
           |
    +------+------+
    |             |
    v             v
MongoDB Atlas   Redis Cloud

           |
           v
+----------------------+
| AI Service (Render)  |
| FastAPI              |
+----------------------+

---

# 3. Deployment Components

Component

Frontend

Technology

React + Vite

Hosting

Vercel

---

Component

Backend

Technology

Node.js + Express

Hosting

Render

---

Component

AI Service

Technology

FastAPI

Hosting

Render

---

Component

Database

Technology

MongoDB Atlas

Hosting

Atlas Cloud

---

Component

Cache

Technology

Redis

Hosting

Redis Cloud

---

# 4. Frontend Deployment

Provider

Vercel

---

Build Command

npm run build

---

Output Directory

dist

---

Environment Variables

VITE_API_URL

VITE_SOCKET_URL

---

Example

VITE_API_URL=https://api.devconnect.com

VITE_SOCKET_URL=https://api.devconnect.com

---

Deployment Steps

1. Connect GitHub Repository

2. Import Project

3. Select frontend folder

4. Configure Environment Variables

5. Deploy

---

# 5. Backend Deployment

Provider

Render

---

Runtime

Node.js

---

Build Command

npm install

---

Start Command

npm start

---

Environment Variables

PORT

MONGO_URI

JWT_SECRET

REDIS_URL

AI_SERVICE_URL

NODE_ENV

---

Example

PORT=5000

NODE_ENV=production

---

Deployment Steps

1. Create Web Service

2. Connect GitHub Repository

3. Select backend folder

4. Configure Variables

5. Deploy

---

# 6. AI Service Deployment

Provider

Render

---

Runtime

Python

---

Build Command

pip install -r requirements.txt

---

Start Command

uvicorn app.main:app --host 0.0.0.0 --port 8000

---

Environment Variables

MODEL_NAME

LOG_LEVEL

---

Example

MODEL_NAME=all-MiniLM-L6-v2

LOG_LEVEL=INFO

---

Deployment Steps

1. Create Python Service

2. Connect Repository

3. Select ai-service folder

4. Configure Variables

5. Deploy

---

# 7. MongoDB Atlas Setup

Provider

MongoDB Atlas

---

Cluster Type

Free Tier (Development)

M10+ (Production)

---

Database Name

devconnect

---

Collections

users

student_profiles

recruiter_profiles

jobs

applications

notifications

audit_logs

ai_match_results

---

Security

Enable:

IP Whitelisting

Database User Authentication

TLS Encryption

---

Connection String

mongodb+srv://...

---

Store In

MONGO_URI

---

# 8. Redis Cloud Setup

Provider

Redis Cloud

---

Purpose

Cache Layer

---

Use Cases

Job Listings Cache

Dashboard Statistics Cache

Search Cache

Session Cache

---

Environment Variable

REDIS_URL

---

# 9. Docker Strategy

Containers

Frontend

Backend

AI Service

---

Docker Structure

docker/

├── frontend/
│   └── Dockerfile
│
├── backend/
│   └── Dockerfile
│
├── ai-service/
│   └── Dockerfile
│
└── docker-compose.yml

---

# 10. Backend Dockerfile

FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]

---

# 11. AI Dockerfile

FROM python:3.11

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]

---

# 12. Frontend Dockerfile

FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4173

CMD ["npm","run","preview"]

---

# 13. Docker Compose

Services

frontend

backend

ai-service

mongodb

redis

---

Purpose

Local development environment.

---

Command

docker-compose up --build

---

# 14. Environment Variables

Backend

PORT

MONGO_URI

JWT_SECRET

REDIS_URL

AI_SERVICE_URL

NODE_ENV

---

Frontend

VITE_API_URL

VITE_SOCKET_URL

---

AI Service

MODEL_NAME

LOG_LEVEL

---

# 15. Security Configuration

Production Requirements

✓ HTTPS

✓ JWT Authentication

✓ Environment Variables

✓ Secure Mongo Credentials

✓ Secure Redis Credentials

✓ CORS Configuration

---

Never Expose

JWT_SECRET

Database Passwords

Redis Passwords

API Keys

---

# 16. CORS Configuration

Allowed Origins

Frontend URL

Admin URL

Development Localhost

---

Example

https://devconnect.vercel.app

http://localhost:5173

---

# 17. CI/CD Strategy

Source Control

GitHub

---

Workflow

Developer

↓

Feature Branch

↓

Pull Request

↓

Develop

↓

Testing

↓

Main

↓

Auto Deploy

---

# 18. Monitoring

Backend Monitoring

Render Dashboard

---

AI Service Monitoring

Render Dashboard

---

Database Monitoring

MongoDB Atlas Metrics

---

Redis Monitoring

Redis Cloud Dashboard

---

# 19. Backup Strategy

MongoDB Atlas Automated Backups

---

Export Critical Collections Weekly

users

jobs

applications

---

Store Backup Securely

---

# 20. Deployment Checklist

Before Production

✓ Frontend Builds

✓ Backend Builds

✓ AI Service Builds

✓ MongoDB Connected

✓ Redis Connected

✓ JWT Working

✓ APIs Tested

✓ Docker Tested

✓ Environment Variables Configured

✓ HTTPS Enabled

---

# 21. Rollback Plan

If Deployment Fails

1. Revert To Previous Commit

2. Redeploy Previous Stable Version

3. Verify APIs

4. Verify Database Connectivity

5. Verify Frontend Functionality

---

# 22. Production URLs

Frontend

https://devconnect.vercel.app

---

Backend

https://devconnect-api.onrender.com

---

AI Service

https://devconnect-ai.onrender.com

---

(Replace with actual URLs after deployment)

---

# 23. Success Criteria

Deployment is successful when:

✓ Frontend Accessible

✓ Backend Accessible

✓ AI Service Accessible

✓ MongoDB Connected

✓ Redis Connected

✓ Authentication Works

✓ Job System Works

✓ AI Features Work

✓ Notifications Work

---

# 24. Status

Status: APPROVED

Version: 1.0

Deployment State: FROZEN