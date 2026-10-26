"""
FastAPI Skill Gap Analysis Router
Milestone 5: AI Skill Gap Analyzer & Student Career Intelligence
"""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from app.services.skill_gap_service import analyze_skill_gap, get_taxonomy_roles

router = APIRouter(prefix="/api/v1/ai", tags=["AI Skill Gap Analyzer"])


class SkillGapRequest(BaseModel):
    targetRole: str = Field(..., description="Target role name (e.g., 'Backend Developer')")
    studentSkills: Optional[List[str]] = Field(default_factory=list, description="Array of student skills")


class SkillGapResponse(BaseModel):
    success: bool = True
    message: str = "Skill gap analysis completed successfully"
    data: dict


@router.get("/skill-gap/roles")
def list_taxonomy_roles():
    """List all supported career role taxonomies."""
    roles = get_taxonomy_roles()
    return {"success": True, "data": roles}


@router.post("/skill-gap", response_model=SkillGapResponse)
def compute_skill_gap(payload: SkillGapRequest):
    """Compute missing skills, career readiness score, and recommendations."""
    try:
        result = analyze_skill_gap(
            student_skills=payload.studentSkills or [],
            target_role=payload.targetRole
        )
        return SkillGapResponse(
            success=True,
            message=f"Skill gap analysis completed successfully for role '{result['targetRole']}'",
            data=result
        )
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
