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
    """Normalize whitespace, Unicode ligatures, and clean non-printable characters."""
    if not text:
        return ""
    import unicodedata
    # Normalize unicode ligatures (e.g. fi, fl) and characters
    text = unicodedata.normalize("NFKD", text)
    # Normalize dashes and carriage returns
    text = text.replace("–", "-").replace("—", "-")
    text = re.sub(r"\r+", "", text)

    # Check if text suffers from the word-per-line PDF artifact (e.g. \n \n between almost every word)
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if lines and (sum(len(line.split()) for line in lines) / len(lines)) < 2.5:
        # Separate bullet symbols so bullets stay on newlines
        text = re.sub(r"[●•]\s*", "\n• ", text)
        # Protect paragraph breaks (3 or more consecutive newlines with spaces)
        text = re.sub(r"(?:\n\s*){3,}", "<<<PARAGRAPH>>>", text)
        # Collapse single/double newlines between words into a single space
        text = re.sub(r"\n\s*\n", " ", text)
        text = re.sub(r"\n", " ", text)
        text = text.replace("<<<PARAGRAPH>>>", "\n\n")
        # Put bullets back on clean newlines
        text = re.sub(r"\s*•\s*", "\n• ", text)

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


def extract_social_links(text: str) -> Tuple[Optional[str], Optional[str]]:
    """Extract GitHub and LinkedIn profile URLs."""
    gh_match = re.search(r"https?://(?:www\.)?github\.com/[a-zA-Z0-9_/-]+", text, re.IGNORECASE)
    li_match = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_/-]+", text, re.IGNORECASE)

    github_url = gh_match.group(0).strip() if gh_match else None
    linkedin_url = li_match.group(0).strip() if li_match else None

    if linkedin_url and not linkedin_url.startswith("http"):
        linkedin_url = "https://" + linkedin_url

    return github_url, linkedin_url


def extract_candidate_name(text: str) -> Optional[str]:
    """Extract candidate name from the top header lines."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    for line in lines[:5]:
        # Filter out lines containing email, URL, or phone
        if "@" in line or "http" in line or "www." in line or re.search(r"\d", line):
            continue
        words = line.split()
        cand = []
        for w in words:
            if re.match(r"^[A-Z][a-zA-Z.'-]*$", w) and not re.match(
                r"^(B\.?Tech|M\.?Tech|B\.?E|BCA|MCA|Computer|Engineering|Resume|Curriculum)$",
                w,
                re.IGNORECASE
            ):
                cand.append(w)
            else:
                break
        if 2 <= len(cand) <= 4:
            return " ".join(cand).title()
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
    """Extract education details: institution, degree, field of study/branch, graduation year."""
    degree_patterns = [
        r"\b(B\.?Tech(?:nology)?|B\.?E\.?|Bachelor(?:\s+of\s+(?:Technology|Engineering|Science|Arts|Computer Applications))?|B\.?S\.?|BCA)\b",
        r"\b(M\.?Tech(?:nology)?|M\.?E\.?|Master(?:\s+of\s+(?:Technology|Engineering|Science|Arts|Computer Applications))?|M\.?S\.?|MCA|MBA)\b",
        r"\b(Ph\.?D|Doctorate)\b"
    ]

    field_patterns = [
        r"\b(Computer Science(?: and Engineering| Engineering)?(?:\s*\([^)]+\))?|Information Technology|Data Science|Software Engineering|Electronics|Electrical Engineering|Mechanical Engineering)\b"
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
            cand = re.split(r"[\n\r|]", cand)[0].strip()
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
            "branch": field_of_study,
            "graduationYear": graduation_year
        }
    return None


def extract_projects(text: str) -> List[Dict[str, Any]]:
    """Extract project titles, bullet points, and tech stacks."""
    proj_section_match = re.search(
        r"(?:PROJECTS|ACADEMIC PROJECTS|PERSONAL PROJECTS|KEY PROJECTS)\b(.*?)(?:EDUCATION|EXPERIENCE|CERTIFICATIONS|SKILLS|ACHIEVEMENTS|$)",
        text,
        re.IGNORECASE | re.DOTALL
    )

    projects = []
    if proj_section_match:
        section_text = proj_section_match.group(1).strip()
        section_text = re.sub(r'(\.\s*|\n)(?=([A-Z][^•\n]{3,60}?\|\s*(?:GitHub|Live|\b)))', r'\1\n', section_text)
        lines = [line.strip() for line in section_text.split("\n") if line.strip()]
        current_project = None

        for line in lines:
            if line.startswith(("-", "•", "*", ">", "●")):
                desc = line.lstrip("-•*>● ").strip()
                if current_project:
                    if current_project["description"]:
                        current_project["description"] += " " + desc
                    else:
                        current_project["description"] = desc
            else:
                clean_line = line.strip()
                if len(clean_line) >= 4:
                    if current_project:
                        projects.append(current_project)

                    title = clean_line
                    if "|" in clean_line:
                        title = clean_line.split("|")[0].strip()

                    techs = extract_skills(clean_line)
                    current_project = {
                        "title": title[:150],
                        "description": "",
                        "technologies": techs,
                        "techStack": techs
                    }

        if current_project:
            projects.append(current_project)

    valid_projects = []
    for p in projects:
        title = p.get("title", "").strip()
        desc = p.get("description", "").strip()
        if len(title) >= 3 and not re.match(r"^[-–—|•]+$", title):
            if not desc:
                desc = f"Built and developed {title} utilizing modern engineering practices."
            p["description"] = desc[:2000]
            valid_projects.append(p)

    return valid_projects[:5]


def extract_certifications(text: str) -> List[str]:
    """Extract listed certifications from resume, splitting inline pipe items if present."""
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
            parts = [p.strip() for p in line.split("|")]
            for part in parts:
                cleaned = part.lstrip("-•*>● 0123456789.)").strip()
                if 4 <= len(cleaned) <= 120 and not re.match(r"^[0-9\s.,-]+$", cleaned):
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
            "githubUrl": None,
            "linkedinUrl": None,
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
    github_url, linkedin_url = extract_social_links(cleaned_text)

    headline = None
    if skills:
        top_skills = skills[:3]
        headline = f"Aspiring Engineer | {', '.join(top_skills)}"

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "headline": headline,
        "githubUrl": github_url,
        "linkedinUrl": linkedin_url,
        "summary": cleaned_text[:300].strip() if cleaned_text else None,
        "skills": skills,
        "education": education,
        "projects": projects,
        "certifications": certifications
    }
