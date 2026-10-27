# DevConnect — Multi-Cloud Production Deployment Runbook

**Milestone 9: Cloud Deployment & Release Operations**  
**Version:** 1.0  
**Stack:** React + Vite (Vercel) • Node.js Express (Render) • FastAPI AI Microservice (Render) • MongoDB Atlas • Redis Cloud

---

## 1. Architecture Overview

```
                      +-----------------------------+
                      |      End Users & Clients    |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |      Frontend (Vercel)      |
                      |   React 19 + Vite (SPA)     |
                      |   https://<app>.vercel.app  |
                      +--------------+--------------+
                                     |
                       REST API / WebSocket (Socket.IO)
                                     |
                                     v
                      +-----------------------------+
                      |    Backend API (Render)     |
                      |  Node.js 20 / Express API   |
                      |  https://<api>.onrender.com |
                      +-------+-------------+-------+
                              |             |
                 +------------+             +------------+
                 |                                       |
                 v                                       v
    +-------------------------+             +-------------------------+
    |   MongoDB Atlas (M0)    |             |       Redis Cloud       |
    | Managed NoSQL Database  |             | In-Memory Cache (30MB)  |
    +-------------------------+             +-------------------------+
                 |
                 v Internal HTTP
    +-----------------------------+
    |  AI Microservice (Render)   |
    |  Python 3.11 / FastAPI      |
    |  https://<ai>.onrender.com  |
    +-----------------------------+
```

---

## 2. Step 1: Managed Cloud Databases Setup

### A. MongoDB Atlas (Database)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create an **M0 Free Shared Cluster** (e.g., in `AWS / Mumbai (ap-south-1)` or nearest region).
3. **Database Access (User)**:
   - Go to **Security > Database Access** > **Add New Database User**.
   - Authentication Method: **Password**.
   - Role: **Read and write to any database** (`dbAdminAnyDatabase` or `readWriteAnyDatabase`).
   - Save your username and password securely.
4. **Network Access (IP Whitelist)**:
   - Go to **Security > Network Access** > **Add IP Address**.
   - Select **Allow Access From Anywhere (`0.0.0.0/0`)** (Required for Render dynamic IPs).
5. **Get Connection String**:
   - Click **Connect** > **Drivers** (Node.js).
   - Copy connection URI. It will look like:
     ```
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/devconnect?retryWrites=true&w=majority
     ```

### B. Redis Cloud (In-Memory Cache)
1. Log in to [Redis Cloud](https://app.redislabs.com/).
2. Create a free 30MB subscription database (e.g. `Fixed / Free 30MB`).
3. Under **Configuration > General**, copy:
   - **Public Endpoint**: `redis-12345.c10.us-east-1-2.ec2.cloud.redislabs.com:12345`
   - **Default User Password**: Under **Security > Default user password**.
4. Construct your `REDIS_URL`:
   ```
   redis://:<password>@redis-12345.c10.us-east-1-2.ec2.cloud.redislabs.com:12345
   ```

---

## 3. Step 2: Deploying to Render (Backend & AI Microservice)

You can deploy using either the **Automated Blueprint** or **Manual Setup**.

### Option A: 1-Click Automated Blueprint (Recommended)
1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `utkarshpal14/DevConnect`.
4. Render will detect the root `render.yaml` and configure both services:
   - `devconnect-ai-service` (Python / FastAPI)
   - `devconnect-backend` (Node.js / Express)
5. Under Environment Variables:
   - Enter your `MONGO_URI`
   - Enter your `REDIS_URL`
   - Enter your `FRONTEND_URL` (e.g. `https://devconnect.vercel.app`)
   - `JWT_SECRET` is auto-generated automatically.
6. Click **Apply**. Both services will build and deploy!

### Option B: Manual Service Creation
If setting up services individually:

#### 1. AI Microservice:
- **Type:** Web Service
- **Root Directory:** `ai-service`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/api/v1/ai/health`
- **Instance Type:** Free

#### 2. Backend API Server:
- **Type:** Web Service
- **Root Directory:** `backend`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/v1/health`
- **Instance Type:** Free
- **Environment Variables**:
  | Variable | Value |
  | :--- | :--- |
  | `NODE_ENV` | `production` |
  | `PORT` | `10000` |
  | `MONGO_URI` | *Your Atlas connection string* |
  | `REDIS_URL` | *Your Redis Cloud connection string* |
  | `JWT_SECRET` | *Random 64-character secret string* |
  | `JWT_EXPIRES_IN` | `7d` |
  | `AI_SERVICE_URL` | `https://devconnect-ai-service.onrender.com` |
  | `FRONTEND_URL` | `https://devconnect.vercel.app` |

---

## 4. Step 3: Deploying Frontend to Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** > **Project**.
3. Import your GitHub repository: `utkarshpal14/DevConnect`.
4. In the Project Configuration screen:
   - **Framework Preset:** Vite
   - **Root Directory:** Click Edit and select `frontend`
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `dist` (or leave default)
5. **Environment Variables**:
   Add the following under **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | `https://devconnect-backend.onrender.com` | Backend REST API domain (no trailing slash) |
   | `VITE_SOCKET_URL` | `https://devconnect-backend.onrender.com` | Backend Socket.IO domain (same as API) |
6. Click **Deploy**.
7. Vercel will build the frontend in ~20 seconds and assign your production URL:
   `https://devconnect-<username>.vercel.app`

---

## 5. Step 4: Post-Deployment Smoke Testing & Health Checks

Once deployed, run these verification tests:

### 1. AI Service Health Check
```bash
curl -s https://devconnect-ai-service.onrender.com/api/v1/ai/health
```
**Expected Response:**
```json
{
  "success": true,
  "message": "DevConnect AI Microservice is operational",
  "service": "fastapi"
}
```

### 2. Backend Health Check
```bash
curl -s https://devconnect-backend.onrender.com/api/v1/health
```
**Expected Response:**
```json
{
  "success": true,
  "message": "DevConnect Backend API is healthy and operational",
  "data": { "timestamp": "2026-..." }
}
```

### 3. End-to-End Application Flow
1. Open your Vercel deployment URL (`https://<app>.vercel.app`).
2. Verify 3D perspective scene, mesh grid animation, and floating holograms render smoothly.
3. Register a new student account (`Student` role).
4. Navigate to **Portfolio** > Upload a test PDF resume:
   - Verify parsing modal extracts technical skills, projects, and certifications.
   - Click **Save & Synchronize** to update student profile.
5. Log out and register a recruiter account (`Recruiter` role):
   - Post a new Job opening with required skills.
   - Inspect Candidate Match scoring badge and skill-gap breakdown chips.

---

## 6. Production Troubleshooting & FAQs

### A. Render Free Tier Cold Starts
- **Symptom:** First API request after 15 minutes of inactivity takes 30-50 seconds.
- **Cause:** Render free tier spins down idle containers to 0 instances.
- **Solution:** Normal behavior for free tier. Once awakened, subsequent requests respond in < 50ms (accelerated by Redis Cloud caching).

### B. CORS Errors in Browser
- **Symptom:** `Access-Control-Allow-Origin` error in browser console.
- **Fix:** In Render backend settings, verify `FRONTEND_URL` matches your exact Vercel domain (e.g. `https://devconnect.vercel.app` without trailing slash).

### C. MongoDB Atlas Connection Timeout
- **Symptom:** `MongoServerSelectionError: connect ETIMEDOUT`
- **Fix:** Ensure Atlas **Network Access** includes `0.0.0.0/0` (Allow access from anywhere).

### D. SPA Refresh 404s on Vercel
- **Symptom:** Refreshing `https://<app>.vercel.app/#register` or deep routes yields 404.
- **Fix:** Handled automatically by [frontend/vercel.json](file:///c:/Users/Utkarsh%20Pal/Documents/DevConnect/frontend/vercel.json) rewrites to `/index.html`.
