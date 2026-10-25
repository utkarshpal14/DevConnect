"""
Resume Parsing Service
Extracts structured information from PDF resumes using text extraction and skill dictionary matching.
"""

import io
import re
import json
import os
from typing import Dict, Any, List, Optional, Tuple
from pypdf import PdfReader


def load_skills_dictionary() -> Tuple[List[str], Dict[str, str]]:
    """Load canonical skills and aliases from JSON dictionary."""
    dict_path = os.path.join(os.path.dirname(__file__), "..", "utils", "skills_dictionary.json")
    try:
        with open(dict_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("skills", []), data.get("aliases", {})
    except Exception:
        return [], {}


CANONICAL_SKILLS, SKILL_ALIASES = load_skills_dictionary()


def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    """Extract raw text from PDF bytes. Returns empty string if unreadable or scanned."""
    if not pdf_bytes:
        return ""
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        extracted_pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_pages.append(text)
        return "\n".join(extracted_pages).strip()
    except Exception:
        return ""


def clean_and_normalize_text(text: str) -> str:
    """Normalize whitespace and clean non-printable characters."""
    if not text:
        return ""
    # Normalize multiple line breaks and carriage returns
    text = re.sub(r"\r+", "", text)
    # Collapse horizontal spaces and tabs into single space
    text = re.sub(r"[ \t]+", " ", text)
    # Collapse more than 2 consecutive linebreaks
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Remove control characters except standard whitespace
    text = "".join(ch for ch in text if ch.isprintable() or ch in ("\n", " "))
    return text.strip()



def extract_email(text: str) -> Optional[str]:
    """Extract email address using standard RFC pattern."""
    match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    """Extract candidate phone number."""
    match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
    return match.group(0).strip() if match else None


def extract_candidate_name(text: str) -> Optional[str]:
    """Extract candidate name from the top header lines."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    for line in lines[:5]:
        # Filter out lines containing email, URL, or phone
        if "@" in line or "http" in line or "www." in line or re.search(r"\d", line):
            continue
        # Check if line looks like a person's name (2-4 words, alphabetic)
        words = line.split()
        if 2 <= len(words) <= 4 and all(re.match(r"^[A-Z][a-zA-Z.'-]*$", w) for w in words):
            return line
    return None


def extract_skills(text: str) -> List[str]:
    """Detect skills using canonical dictionary and alias mappings with boundary-safe regex."""
    if not text:
        return []

    found_skills = set()
    lowered_text = text.lower()

    # 1. Match aliases first and map to canonical name
    for alias, canonical in SKILL_ALIASES.items():
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(alias.lower()) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, lowered_text):
            found_skills.add(canonical)

    # 2. Match canonical skills
    for skill in CANONICAL_SKILLS:
        pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill.lower()) + r"(?![a-zA-Z0-9])"
        if re.search(pattern, lowered_text):
            found_skills.add(skill)

    return sorted(list(found_skills))


def extract_education(text: str) -> Optional[Dict[str, Any]]:
    """Extract education details: institution, degree, field of study, graduation year."""
    degree_patterns = [
        r"\b(B\.?Tech(?:nology)?|B\.?E\.?|Bachelor(?:\s+of\s+(?:Technology|Engineering|Science|Arts|Computer Applications))?|B\.?S\.?|BCA)\b",
        r"\b(M\.?Tech(?:nology)?|M\.?E\.?|Master(?:\s+of\s+(?:Technology|Engineering|Science|Arts|Computer Applications))?|M\.?S\.?|MCA|MBA)\b",
        r"\b(Ph\.?D|Doctorate)\b"
    ]

    field_patterns = [
        r"\b(Computer Science(?: and Engineering)?|Information Technology|Data Science|Software Engineering|Electronics|Electrical Engineering|Mechanical Engineering)\b"
    ]

    institution_keywords = [
        r"([A-Z][a-zA-Z\s&.,'-]*(?:University|Institute|College|Academy|Polytechnic)[a-zA-Z\s&.,'-]*)"
    ]

    year_pattern = r"\b(20[12][0-9])\b"

    degree = None
    for pattern in degree_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            degree = match.group(0).strip()
            break

    field_of_study = None
    for pattern in field_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            field_of_study = match.group(0).strip()
            break

    institution = None
    for pattern in institution_keywords:
        match = re.search(pattern, text)
        if match:
            cand = match.group(0).strip()
            # Clean trailing punctuation
            cand = re.split(r"[\n\r]", cand)[0].strip()
            if len(cand) <= 80:
                institution = cand
                break

    year_match = re.findall(year_pattern, text)
    graduation_year = year_match[-1] if year_match else None

    if institution or degree or field_of_study or graduation_year:
        return {
            "institution": institution,
            "degree": degree,
            "fieldOfStudy": field_of_study,
            "graduationYear": graduation_year
        }
    return None


def extract_projects(text: str) -> List[Dict[str, Any]]:
    """Extract project titles and bullet points if a projects section exists."""
    projects = []
    # Identify project section
    proj_section_match = re.search(
        r"(?:PROJECTS|ACADEMIC PROJECTS|PERSONAL PROJECTS|KEY PROJECTS)\b(.*?)(?:EDUCATION|EXPERIENCE|CERTIFICATIONS|SKILLS|ACHIEVEMENTS|$)",
        text,
        re.IGNORECASE | re.DOTALL
    )

    if proj_section_match:
        section_text = proj_section_match.group(1).strip()
        lines = [line.strip() for line in section_text.split("\n") if line.strip()]
        current_project = None

        for line in lines:
            # Bullet point or descriptive sentence
            if line.startswith(("-", "•", "*", ">")):
                if current_project:
                    desc = line.lstrip("-•*> ").strip()
                    if current_project["description"]:
                        current_project["description"] += " " + desc
                    else:
                        current_project["description"] = desc
            elif len(line) < 60 and not line.endswith("."):
                # Likely a project title
                if current_project:
                    projects.append(current_project)
                current_project = {
                    "title": line,
                    "description": "",
                    "technologies": extract_skills(line)
                }

        if current_project:
            projects.append(current_project)

    return projects[:5]


def extract_certifications(text: str) -> List[str]:
    """Extract listed certifications from resume."""
    cert_section_match = re.search(
        r"(?:CERTIFICATIONS|LICENSES|ACCREDITATIONS)\b(.*?)(?:EDUCATION|EXPERIENCE|PROJECTS|SKILLS|ACHIEVEMENTS|$)",
        text,
        re.IGNORECASE | re.DOTALL
    )

    certifications = []
    if cert_section_match:
        section_text = cert_section_match.group(1).strip()
        lines = [line.strip() for line in section_text.split("\n") if line.strip()]
        for line in lines:
            cleaned = line.lstrip("-•*> 0123456789.)").strip()
            if 4 <= len(cleaned) <= 90:
                certifications.append(cleaned)

    return certifications[:6]


def parse_resume_bytes(pdf_bytes: bytes, filename: str = "resume.pdf") -> Dict[str, Any]:
    """
    Main parser execution function.
    Reads PDF bytes, cleans text, extracts all structured fields, and returns a verified dictionary.
    """
    text = extract_text_from_pdf_bytes(pdf_bytes)
    cleaned_text = clean_and_normalize_text(text)

    # If document has no extractable text (e.g. image-only or scanned PDF)
    if not cleaned_text:
        return {
            "name": None,
            "email": None,
            "phone": None,
            "headline": None,
            "summary": "Document contains no readable text layer (may be scanned or an image).",
            "skills": [],
            "education": None,
            "projects": [],
            "certifications": []
        }

    skills = extract_skills(cleaned_text)
    education = extract_education(cleaned_text)
    projects = extract_projects(cleaned_text)
    certifications = extract_certifications(cleaned_text)
    name = extract_candidate_name(cleaned_text)
    email = extract_email(cleaned_text)
    phone = extract_phone(cleaned_text)

    headline = None
    if skills:
        top_skills = skills[:3]
        headline = f"Aspiring Engineer | {', '.join(top_skills)}"

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "headline": headline,
        "summary": cleaned_text[:300].strip() if cleaned_text else None,
        "skills": skills,
        "education": education,
        "projects": projects,
        "certifications": certifications
    }
