/**
 * Frontend AI Resume Service
 * Communicates with Express backend (never directly with FastAPI)
 */

import { getToken } from '../pages/auth/storage.js';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1`;

/**
 * Upload and parse a PDF resume via Express backend AI route
 * @param {File} file PDF resume file object
 * @returns {Promise<object>} Structured parsed resume data
 */
export const parseResume = async (file) => {
  if (!file) {
    throw new Error('Please select a resume file to parse.');
  }

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Invalid file format. Only PDF resumes are accepted.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File exceeds the 5MB size limit. Please upload a smaller PDF.');
  }

  const token = getToken();
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(`${API_BASE_URL}/ai/parse-resume`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Parsing failed with status ${response.status}`);
  }

  return data.data;
};

/**
 * Sync extracted skills to student profile using existing authorized endpoint
 * @param {string} skill Single skill name to add
 */
export const addSkillToProfile = async (skill) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/students/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ skill })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add skill to profile');
  }
  return data.data;
};

/**
 * Update student profile headline, bio, or education using authorized endpoint
 * @param {object} profileData
 */
export const updateStudentProfile = async (profileData) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/students/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(profileData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile details');
  }
  return data.data;
};

/**
 * Add a project to student profile
 * @param {object} projectData { title, description, techStack, githubUrl, liveUrl }
 */
export const addProjectToProfile = async (projectData) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/students/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(projectData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add project to profile');
  }
  return data.data;
};

/**
 * Add a certification to student profile
 * @param {object} certData { title, issuer, issueDate, certificateUrl }
 */
export const addCertificationToProfile = async (certData) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/students/certifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(certData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to add certification to profile');
  }
  return data.data;
};
