import { getToken } from '../auth/storage.js';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
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

export const getProfile = () => request('/students/profile');

export const saveProfile = (profile) => request('/students/profile', {
  method: 'PUT',
  body: JSON.stringify(profile)
});

export const addSkill = (skill) => request('/students/skills', {
  method: 'POST',
  body: JSON.stringify({ skill })
});

export const removeSkill = (skill) => request(`/students/skills/${encodeURIComponent(skill)}`, {
  method: 'DELETE'
});

export const addProject = (project) => request('/students/projects', {
  method: 'POST',
  body: JSON.stringify(project)
});

export const removeProject = (projectId) => request(`/students/projects/${projectId}`, {
  method: 'DELETE'
});

export const addCertification = (certification) => request('/students/certifications', {
  method: 'POST',
  body: JSON.stringify(certification)
});

export const removeCertification = (certificationId) => request(`/students/certifications/${certificationId}`, {
  method: 'DELETE'
});

export const addAchievement = (achievement) => request('/students/achievements', {
  method: 'POST',
  body: JSON.stringify(achievement)
});

export const removeAchievement = (achievementId) => request(`/students/achievements/${achievementId}`, {
  method: 'DELETE'
});

export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return request('/students/resume', { method: 'POST', body: formData });
};
