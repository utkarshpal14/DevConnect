import { getToken } from '../auth/storage.js';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data.data;
};

// Recruiter Profile APIs
export const getRecruiterProfile = () => request('/recruiters/profile');

export const saveRecruiterProfile = (profile) => request('/recruiters/profile', {
  method: 'PUT',
  body: JSON.stringify(profile)
});

// Job Management APIs (Recruiter Scope)
export const createJob = (jobData) => request('/jobs', {
  method: 'POST',
  body: JSON.stringify(jobData)
});

export const updateJob = (jobId, jobData) => request(`/jobs/${jobId}`, {
  method: 'PUT',
  body: JSON.stringify(jobData)
});

export const deleteJob = (jobId) => request(`/jobs/${jobId}`, {
  method: 'DELETE'
});

export const closeJob = (jobId) => request(`/jobs/${jobId}/close`, {
  method: 'PATCH'
});

export const getRecruiterJobs = async () => {
  // Uses the public jobs endpoint and filters or retrieves list
  return request('/jobs?limit=100');
};
