"""
FastAPI Resume Parser Router
Exposes POST /api/v1/ai/parse-resume for multipart PDF uploads.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.models.resume_model import ResumeParserResponse, ParsedResumeData
from app.services.resume_parser_service import parse_resume_bytes

router = APIRouter(prefix="/api/v1/ai", tags=["AI Resume Parser"])

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB


@router.post("/parse-resume", response_model=ResumeParserResponse)
async def parse_resume_endpoint(resume: UploadFile = File(...)):
    """
    Parse an uploaded PDF resume and extract skills, education, projects, and certifications.
    """
    if not resume.filename or not resume.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF resumes are accepted"
        )

    try:
        content = await resume.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded resume file: {str(e)}"
        )

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 5MB limit"
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded resume file is empty"
        )

    parsed_result = parse_resume_bytes(content, filename=resume.filename)

    return ResumeParserResponse(
        success=True,
        message="Resume parsed successfully",
        data=ParsedResumeData(**parsed_result)
    )
