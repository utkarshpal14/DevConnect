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

export const getJobs = async ({ page = 1, limit = 10, search = '', location = '', employmentType = '' } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  if (search && search.trim()) params.append('search', search.trim());
  if (location && location.trim()) params.append('location', location.trim());
  if (employmentType && employmentType.trim()) params.append('employmentType', employmentType.trim());

  const queryString = params.toString();
  return request(`/jobs${queryString ? `?${queryString}` : ''}`);
};

export const getJobById = async (jobId) => {
  return request(`/jobs/${jobId}`);
};
