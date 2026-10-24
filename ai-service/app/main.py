"""
FastAPI Microservice Main Entrypoint
DevConnect AI Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.skill_gap import router as skill_gap_router

app = FastAPI(
    title="DevConnect AI Microservice",
    description="Microservice for resume parsing, candidate match scoring, and skill gap analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/api/v1/ai/health")
def health_check():
    return {
        "success": True,
        "message": "DevConnect AI Microservice is operational",
        "service": "fastapi"
    }

# Mount AI routers
app.include_router(skill_gap_router)
