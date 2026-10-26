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

/**
 * Fetch list of all 5 supported career taxonomy roles
 */
export const getTaxonomyRoles = () => request('/ai/skill-gap/roles');

/**
 * Analyze skill gap for current authenticated student against a target role
 * @param {string} targetRole (e.g. "Backend Developer")
 */
export const analyzeSkillGap = (targetRole) => request('/ai/skill-gap', {
  method: 'POST',
  body: JSON.stringify({ targetRole })
});

/**
 * Quick-add a missing skill directly to student profile
 * @param {string} skill
 */
export const addSkillToProfile = (skill) => request('/students/skills', {
  method: 'POST',
  body: JSON.stringify({ skill })
});
