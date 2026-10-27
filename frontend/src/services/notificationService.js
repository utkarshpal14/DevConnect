/**
 * Notification Service
 * Milestone 8: REST API calls for notifications + Socket.IO client management
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

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

// ── REST API ──────────────────────────────────────

export async function fetchNotifications(page = 1, limit = 20, unreadOnly = false) {
  const params = new URLSearchParams({ page, limit });
  if (unreadOnly) params.set('unread', 'true');
  const res = await fetch(`${API_BASE}/api/v1/notifications?${params}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function fetchUnreadCount() {
  const res = await fetch(`${API_BASE}/api/v1/notifications/unread-count`, {
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function markNotificationRead(id) {
  const res = await fetch(`${API_BASE}/api/v1/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function markAllNotificationsRead() {
  const res = await fetch(`${API_BASE}/api/v1/notifications/read-all`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function deleteNotification(id) {
  const res = await fetch(`${API_BASE}/api/v1/notifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

// ── Socket.IO Client ──────────────────────────────────────
// Lazy-load socket.io-client only when needed (avoids bundle bloat if not supported)

let socket = null;

export function connectSocket(userId, onNotification) {
  // Use dynamic import via window object hack since socket.io CDN may not be bundled
  // We'll use the CDN version via a global io from index.html in production
  // For now, use a simple polling fallback since socket.io-client is not in package.json
  // The socket connection is established via the initSocket function below
  return null;
}

/**
 * Initialize Socket.IO connection for a user.
 * Requires socket.io-client to be available globally (loaded via CDN or npm).
 * @param {string} userId
 * @param {function} onNotification - callback(notification)
 * @returns {object|null} socket instance or null
 */
export function initSocket(userId, onNotification) {
  try {
    // Try to use globally available io (from CDN or npm bundle)
    if (typeof window !== 'undefined' && window.io) {
      socket = window.io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5
      });

      socket.on('connect', () => {
        socket.emit('join', userId);
      });

      socket.on('notification', (notification) => {
        if (onNotification) onNotification(notification);
      });

      socket.on('disconnect', () => {
        console.log('[Socket] Disconnected');
      });

      return socket;
    }
  } catch (e) {
    console.warn('[Socket] Socket.IO client not available:', e.message);
  }
  return null;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export { SOCKET_URL };
