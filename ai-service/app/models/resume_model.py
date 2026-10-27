"""
Pydantic schemas for DevConnect AI Resume Parser
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    institution: Optional[str] = Field(default=None, description="College or university name")
    degree: Optional[str] = Field(default=None, description="Degree earned or pursued (e.g. B.Tech)")
    fieldOfStudy: Optional[str] = Field(default=None, description="Field of study or major (e.g. Computer Science)")
    branch: Optional[str] = Field(default=None, description="Branch or engineering specialization")
    graduationYear: Optional[str] = Field(default=None, description="Expected or completed graduation year")


class ProjectItem(BaseModel):
    title: str = Field(..., description="Project name or title")
    description: Optional[str] = Field(default=None, description="Summary or bullet point of project")
    technologies: List[str] = Field(default_factory=list, description="Technologies or tools used")
    techStack: List[str] = Field(default_factory=list, description="Technologies formatted as techStack")
    githubUrl: Optional[str] = Field(default=None, description="Project GitHub URL")
    liveUrl: Optional[str] = Field(default=None, description="Project live demo URL")


class ParsedResumeData(BaseModel):
    name: Optional[str] = Field(default=None, description="Candidate full name")
    email: Optional[str] = Field(default=None, description="Candidate contact email")
    phone: Optional[str] = Field(default=None, description="Candidate phone number")
    headline: Optional[str] = Field(default=None, description="Extracted professional headline")
    githubUrl: Optional[str] = Field(default=None, description="Candidate GitHub profile URL")
    linkedinUrl: Optional[str] = Field(default=None, description="Candidate LinkedIn profile URL")
    summary: Optional[str] = Field(default=None, description="Professional summary or bio")
    skills: List[str] = Field(default_factory=list, description="Extracted and normalized skills")
    education: Optional[EducationItem] = Field(default=None, description="Primary education details")
    projects: List[ProjectItem] = Field(default_factory=list, description="Extracted academic or personal projects")
    certifications: List[str] = Field(default_factory=list, description="Extracted certification names")


class ResumeParserResponse(BaseModel):
    success: bool = Field(default=True, description="Indicates if parsing completed successfully")
    message: str = Field(default="Resume parsed successfully", description="Status message")
    data: ParsedResumeData
