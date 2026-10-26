/**
 * NotificationBell Component
 * Milestone 8: Live notification bell with unread badge and toast alerts
 *
 * Props:
 *  - user: { _id, role, fullName }
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  initSocket,
  disconnectSocket
} from '../../services/notificationService.js';
import './NotificationBell.css';

const TYPE_ICONS = {
  application_submitted: '📥',
  candidate_shortlisted: '🎉',
  candidate_rejected: '📋',
  candidate_selected: '🏆',
  job_created: '💼',
  status_updated: '🔄',
  general: '🔔'
};

export default function NotificationBell({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const dropdownRef = useRef(null);
  const toastTimers = useRef({});

  // Load notifications on mount and when panel opens
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchNotifications(1, 20);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Socket.IO realtime connection
  useEffect(() => {
    if (!user?._id) return;

    const sock = initSocket(String(user._id), (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      showToast(newNotification);
    });

    return () => {
      if (sock) disconnectSocket();
    };
  }, [user?._id]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const showToast = (notification) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, ...notification }]);
    toastTimers.current[id] = setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id) => {
    clearTimeout(toastTimers.current[id]);
    delete toastTimers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleMarkRead = async (notifId) => {
    try {
      await markNotificationRead(notifId);
      setNotifications(prev =>
        prev.map(n => n._id === notifId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  const handleDelete = async (notifId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notifId);
      const wasUnread = notifications.find(n => n._id === notifId && !n.isRead);
      setNotifications(prev => prev.filter(n => n._id !== notifId));
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (_) {}
  };

  const handleItemClick = (n) => {
    if (!n.isRead) handleMarkRead(n._id);
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <>
      {/* Toast Alerts */}
      <div className="notif-toast-container" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className="notif-toast" role="alert">
            <span className="notif-toast-icon">{TYPE_ICONS[toast.type] || '🔔'}</span>
            <div className="notif-toast-body">
              <div className="notif-toast-title">{toast.title}</div>
              <div className="notif-toast-msg">{toast.message}</div>
            </div>
            <button
              className="notif-toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Bell Icon + Dropdown */}
      <div className="notif-bell-wrapper" ref={dropdownRef}>
        <button
          id="notification-bell-btn"
          className="notif-bell-btn"
          onClick={() => {
            setIsOpen(prev => !prev);
            if (!isOpen) loadNotifications();
          }}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          aria-expanded={isOpen}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="notif-badge" aria-hidden="true">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="notif-dropdown" role="dialog" aria-label="Notifications panel">
            <div className="notif-dropdown-header">
              <span className="notif-dropdown-title">Notifications</span>
              {unreadCount > 0 && (
                <button
                  className="notif-mark-all-btn"
                  onClick={handleMarkAllRead}
                  id="mark-all-read-btn"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="notif-list">
              {loading ? (
                <div className="notif-empty">
                  <div className="notif-spinner" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="notif-empty">
                  <span style={{ fontSize: '32px' }}>🔔</span>
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n._id}
                    className={`notif-item${n.isRead ? '' : ' notif-item--unread'}`}
                    onClick={() => handleItemClick(n)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleItemClick(n)}
                  >
                    <span className="notif-item-icon">{TYPE_ICONS[n.type] || '🔔'}</span>
                    <div className="notif-item-body">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-msg">{n.message}</div>
                      <div className="notif-item-time">{formatTime(n.createdAt)}</div>
                    </div>
                    {!n.isRead && <span className="notif-unread-dot" aria-hidden="true" />}
                    <button
                      className="notif-delete-btn"
                      onClick={(e) => handleDelete(n._id, e)}
                      aria-label="Delete notification"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
