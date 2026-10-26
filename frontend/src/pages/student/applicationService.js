import { getToken } from '../auth/storage.js';

const API_BASE = '/api/v1/applications';

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

/**
 * Submit job application (Student)
 * @param {string} jobId
 */
export async function applyForJob(jobId) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ jobId })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit application.');
  }

  return data.data;
}

/**
 * Fetch all applications for current logged in student (Student)
 */
export async function getMyApplications() {
  const response = await fetch(`${API_BASE}/my`, {
    method: 'GET',
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch applications.');
  }

  return data.data || [];
}

/**
 * Withdraw an application (Student)
 * @param {string} applicationId
 */
export async function withdrawApplication(applicationId) {
  const response = await fetch(`${API_BASE}/${applicationId}/withdraw`, {
    method: 'PATCH',
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to withdraw application.');
  }

  return data.data;
}

/**
 * Get all applicants for a specific job (Recruiter)
 * @param {string} jobId
 */
export async function getJobApplicants(jobId) {
  const response = await fetch(`${API_BASE}/job/${jobId}`, {
    method: 'GET',
    headers: getHeaders()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch job applicants.');
  }

  return data.data || [];
}

/**
 * Update candidate application status (Recruiter)
 * @param {string} applicationId
 * @param {string} status ('Applied' | 'Under Review' | 'Shortlisted' | 'Rejected' | 'Selected')
 */
export async function updateApplicationStatus(applicationId, status) {
  const response = await fetch(`${API_BASE}/${applicationId}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update application status.');
  }

  return data.data;
}
