/**
 * Admin Service
 * Milestone 8: Admin Dashboard REST API calls
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getAuthHeaders() {
  const token = localStorage.getItem('devconnect_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function fetchAdminDashboard() {
  const res = await fetch(`${API_BASE}/api/v1/admin/dashboard`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function fetchAdminUsers({ page = 1, limit = 20, role = '', search = '', isActive = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (role) params.set('role', role);
  if (search) params.set('search', search);
  if (isActive !== '') params.set('isActive', isActive);
  const res = await fetch(`${API_BASE}/api/v1/admin/users?${params}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function toggleUserStatus(userId) {
  const res = await fetch(`${API_BASE}/api/v1/admin/users/${userId}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function fetchAuditLogs({ page = 1, limit = 20, action = '', status = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (action) params.set('action', action);
  if (status) params.set('status', status);
  const res = await fetch(`${API_BASE}/api/v1/admin/audit-logs?${params}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}
