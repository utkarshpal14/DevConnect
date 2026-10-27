import { getToken } from '../auth/storage.js';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE_URL = `${API_BASE}/api/v1`;

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data.data;
};

/**
 * Evaluate AI match score for a candidate against a job
 * @param {string} studentId 
 * @param {string} jobId 
 * @returns {Promise<object>} Match evaluation data
 */
export const matchCandidate = (studentId, jobId) => {
  return request('/ai/match-candidate', {
    method: 'POST',
    body: JSON.stringify({ studentId, jobId })
  });
};

/**
 * Fetch all stored candidate match evaluations for a job
 * @param {string} jobId 
 * @returns {Promise<Array<object>>}
 */
export const getJobMatchResults = (jobId) => {
  return request(`/ai/match-candidate/job/${jobId}`);
};
