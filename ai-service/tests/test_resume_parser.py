"""
Pytest Test Suite for DevConnect AI Resume Parser
Tests extraction accuracy, dictionary matching, PDF reading, and API endpoints.
"""

import io
import os
import sys
import pytest

# Ensure ai-service root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from pypdf import PdfWriter
from fastapi.testclient import TestClient

from app.main import app

from app.services.resume_parser_service import (
    clean_and_normalize_text,
    extract_skills,
    extract_education,
    extract_email,
    extract_phone,
    parse_resume_bytes,
    load_skills_dictionary
)


client = TestClient(app)


def create_sample_pdf_bytes(text_content: str) -> bytes:
    """Helper to generate a valid PDF byte string for testing."""
    # pypdf Writer can create an empty page or we can use pdf bytes
    writer = PdfWriter()
    page = writer.add_blank_page(width=612, height=792)
    # pypdf doesn't easily render text directly onto canvas without reportlab,
    # but we can test parser service directly with text and test endpoint with PDF bytes
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


class TestResumeParserUnit:
    """Unit tests for resume parser text cleaning and entity extraction."""

    def test_skills_dictionary_loads(self):
        canonical_skills, aliases = load_skills_dictionary()
        assert len(canonical_skills) > 50
        assert "React" in canonical_skills
        assert "Python" in canonical_skills
        assert "Docker" in canonical_skills
        assert aliases.get("reactjs") == "React"
        assert aliases.get("nodejs") == "Node.js"

    def test_clean_and_normalize_text(self):
        raw = "John   Doe\r\n\r\n\r\nSoftware   Engineer\t\tSpecialist"
        cleaned = clean_and_normalize_text(raw)
        assert "\r" not in cleaned
        assert "\t" not in cleaned
        assert "John Doe" in cleaned

    def test_extract_skills_canonical_and_aliases(self):
        text = "Experience with ReactJS, node.js, TypeScript, PostgreSQL, and Docker."
        skills = extract_skills(text)
        assert "React" in skills
        assert "Node.js" in skills
        assert "TypeScript" in skills
        assert "PostgreSQL" in skills
        assert "Docker" in skills

    def test_extract_skills_word_boundaries(self):
        # Ensure substring 'go' does not match within 'category' or 'negotiate'
        text = "I negotiate category deals for retail."
        skills = extract_skills(text)
        assert "Go" not in skills

    def test_extract_email_and_phone(self):
        text = "Contact: alex.dev@example.com or call +1 555-234-5678."
        email = extract_email(text)
        phone = extract_phone(text)
        assert email == "alex.dev@example.com"
        assert "555-234-5678" in phone

    def test_extract_education(self):
        text = "Bachelor of Technology in Computer Science from Chitkara University, 2025."
        edu = extract_education(text)
        assert edu is not None
        assert "Bachelor of Technology" in edu["degree"]
        assert "Computer Science" in edu["fieldOfStudy"]
        assert edu["graduationYear"] == "2025"
        assert "Chitkara University" in edu["institution"]

    def test_parse_scanned_or_empty_pdf(self):
        # Empty byte input
        result = parse_resume_bytes(b"")
        assert result["skills"] == []
        assert result["name"] is None
        assert "no readable text" in result["summary"]


class TestResumeParserAPI:
    """Integration tests for FastAPI endpoints."""

    def test_health_check_endpoint(self):
        response = client.get("/api/v1/ai/health")
        assert response.status_code == 200
        json_data = response.json()
        assert json_data["success"] is True
        assert "operational" in json_data["message"]

    def test_reject_non_pdf_file(self):
        response = client.post(
            "/api/v1/ai/parse-resume",
            files={"resume": ("document.docx", b"word doc content", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
        )
        assert response.status_code == 400
        assert "Only PDF resumes are accepted" in response.json()["detail"]

    def test_reject_empty_file(self):
        response = client.post(
            "/api/v1/ai/parse-resume",
            files={"resume": ("empty.pdf", b"", "application/pdf")}
        )
        assert response.status_code == 400
        assert "empty" in response.json()["detail"]

    def test_parse_valid_blank_pdf(self):
        pdf_bytes = create_sample_pdf_bytes("Blank document")
        response = client.post(
            "/api/v1/ai/parse-resume",
            files={"resume": ("test_resume.pdf", pdf_bytes, "application/pdf")}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert isinstance(data["data"]["skills"], list)
