/**
 * AdminDashboard.jsx
 * Milestone 8: Complete Admin Dashboard UI
 *
 * Props:
 *  - user: { _id, fullName, email, role }
 *  - onLogout: function
 */

import React, { useState, useEffect, useCallback } from 'react';
import NotificationBell from '../../components/notifications/NotificationBell.jsx';
import {
  fetchAdminDashboard,
  fetchAdminUsers,
  toggleUserStatus,
  fetchAuditLogs
} from '../../services/adminService.js';
import './adminDashboard.css';

// ── KPI Card ────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon, color }) {
  return (
    <div className="admin-kpi-card" style={{ '--accent': color }}>
      <div className="admin-kpi-icon">{icon}</div>
      <div className="admin-kpi-body">
        <div className="admin-kpi-value">{value ?? '—'}</div>
        <div className="admin-kpi-label">{label}</div>
        {sub && <div className="admin-kpi-sub">{sub}</div>}
      </div>
    </div>
  );
}

// ── Status Badge ────────────────────────────────────────────
function StatusBadge({ active }) {
  return (
    <span className={`admin-status-badge ${active ? 'admin-status-badge--active' : 'admin-status-badge--disabled'}`}>
      <span className="admin-status-dot" />
      {active ? 'Active' : 'Disabled'}
    </span>
  );
}

// ── Role Badge ──────────────────────────────────────────────
function RoleBadge({ role }) {
  const colors = { admin: '#8b5cf6', recruiter: '#3b82f6', student: '#10b981' };
  return (
    <span className="admin-role-badge" style={{ background: `${colors[role] || '#666'}22`, color: colors[role] || '#ccc', borderColor: `${colors[role] || '#666'}44` }}>
      {role}
    </span>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function AdminDashboard({ user, onBrowseJobs, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Users tab state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Audit Logs tab state
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logPagination, setLogPagination] = useState(null);
  const [logStatus, setLogStatus] = useState('');

  // Load dashboard stats
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetchAdminDashboard();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err.message);
    }
    setStatsLoading(false);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Load users
  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetchAdminUsers({
        page: userPage,
        limit: 15,
        role: userRoleFilter,
        search: userSearch,
        isActive: userStatusFilter
      });
      setUsers(res.data.users || []);
      setUserPagination(res.data.pagination);
    } catch (_) {}
    setUsersLoading(false);
  }, [userPage, userRoleFilter, userSearch, userStatusFilter]);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
  }, [activeTab, loadUsers]);

  // Load audit logs
  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetchAuditLogs({ page: logPage, limit: 20, status: logStatus });
      setLogs(res.data.logs || []);
      setLogPagination(res.data.pagination);
    } catch (_) {}
    setLogsLoading(false);
  }, [logPage, logStatus]);

  useEffect(() => {
    if (activeTab === 'audit') loadLogs();
  }, [activeTab, loadLogs]);

  const handleToggleUser = async (userId) => {
    setTogglingId(userId);
    try {
      const res = await toggleUserStatus(userId);
      setUsers(prev =>
        prev.map(u => u._id === userId ? { ...u, isActive: res.data.user.isActive } : u)
      );
    } catch (err) {
      alert(`Failed: ${err.message}`);
    }
    setTogglingId(null);
  };

  const handleUserSearch = (e) => {
    setUserSearch(e.target.value);
    setUserPage(1);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString() : '—';

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-brand">
            <span className="admin-brand-icon">⚡</span>
            <span className="admin-brand-name">DevConnect</span>
          </div>
          <span className="admin-badge-label">Admin Panel</span>
        </div>
        <div className="admin-header-right">
          <NotificationBell user={user} />
          {onBrowseJobs && (
            <button
              type="button"
              className="admin-refresh-btn"
              style={{ fontSize: '12px', padding: '6px 12px', cursor: 'pointer' }}
              onClick={onBrowseJobs}
            >
              Public Job Board &rarr;
            </button>
          )}
          <div className="admin-user-info">
            <span className="admin-user-name">{user.fullName}</span>
            <span className="admin-user-role">Administrator</span>
          </div>
          <button id="admin-logout-btn" className="admin-logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="admin-tabs">
        {[
          { id: 'dashboard', label: '📊 Dashboard', ariaLabel: 'Dashboard tab' },
          { id: 'users', label: '👥 Users', ariaLabel: 'Users tab' },
          { id: 'audit', label: '📋 Audit Logs', ariaLabel: 'Audit Logs tab' }
        ].map(tab => (
          <button
            key={tab.id}
            id={`admin-tab-${tab.id}`}
            className={`admin-tab-btn${activeTab === tab.id ? ' admin-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.ariaLabel}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="admin-content">
        {/* ── Dashboard Tab ──────────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <section className="admin-section" aria-label="Dashboard statistics">
            <div className="admin-section-header">
              <h1 className="admin-section-title">Platform Overview</h1>
              <button id="admin-refresh-btn" className="admin-refresh-btn" onClick={loadStats} disabled={statsLoading}>
                {statsLoading ? '⟳ Loading…' : '↻ Refresh'}
              </button>
            </div>

            {statsLoading ? (
              <div className="admin-loading">
                <div className="admin-spinner" />
                <span>Loading statistics…</span>
              </div>
            ) : stats ? (
              <>
                {/* User KPIs */}
                <h2 className="admin-group-label">Users</h2>
                <div className="admin-kpi-grid">
                  <KpiCard label="Total Users" value={stats.users.total} icon="👤" color="#58a6ff" sub={`${stats.users.active} active`} />
                  <KpiCard label="Students" value={stats.users.students} icon="🎓" color="#3fb950" />
                  <KpiCard label="Recruiters" value={stats.users.recruiters} icon="💼" color="#d2a8ff" />
                  <KpiCard label="Disabled Accounts" value={stats.users.disabled} icon="🚫" color="#f85149" />
                </div>

                {/* Job KPIs */}
                <h2 className="admin-group-label">Jobs</h2>
                <div className="admin-kpi-grid">
                  <KpiCard label="Total Jobs" value={stats.jobs.total} icon="📋" color="#58a6ff" />
                  <KpiCard label="Active Listings" value={stats.jobs.active} icon="✅" color="#3fb950" />
                  <KpiCard label="Closed Listings" value={stats.jobs.closed} icon="🔒" color="#8b949e" />
                </div>

                {/* Application KPIs */}
                <h2 className="admin-group-label">Applications</h2>
                <div className="admin-kpi-grid">
                  <KpiCard label="Total Applications" value={stats.applications.total} icon="📨" color="#58a6ff" />
                  <KpiCard label="Applied" value={stats.applications.applied} icon="📤" color="#8b949e" />
                  <KpiCard label="Shortlisted" value={stats.applications.shortlisted} icon="⭐" color="#e3b341" />
                  <KpiCard label="Selected" value={stats.applications.selected} icon="🏆" color="#3fb950" />
                </div>

                {/* Notification KPIs */}
                <h2 className="admin-group-label">Notifications</h2>
                <div className="admin-kpi-grid">
                  <KpiCard label="Total Sent" value={stats.notifications.total} icon="🔔" color="#58a6ff" />
                  <KpiCard label="Unread" value={stats.notifications.unread} icon="📬" color="#f85149" />
                </div>

                {/* Recent Activity */}
                {stats.recentActivity && stats.recentActivity.length > 0 && (
                  <>
                    <h2 className="admin-group-label">Recent Activity</h2>
                    <div className="admin-activity-list">
                      {stats.recentActivity.map(log => (
                        <div key={log._id} className="admin-activity-item">
                          <span className="admin-activity-action">{log.action.replace(/_/g, ' ')}</span>
                          <span className="admin-activity-actor">
                            {log.actorId ? log.actorId.email : 'system'}
                          </span>
                          <span className="admin-activity-time">{formatDate(log.createdAt)}</span>
                          <span className={`admin-activity-status admin-activity-status--${log.status}`}>
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="admin-empty">Unable to load dashboard statistics. Is the backend running?</div>
            )}
          </section>
        )}

        {/* ── Users Tab ──────────────────────────────────────────── */}
        {activeTab === 'users' && (
          <section className="admin-section" aria-label="User management">
            <div className="admin-section-header">
              <h1 className="admin-section-title">User Management</h1>
              <span className="admin-total-label">{userPagination?.total ?? 0} users</span>
            </div>

            {/* Filters */}
            <div className="admin-filters">
              <input
                id="admin-user-search"
                type="text"
                className="admin-input"
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={handleUserSearch}
                aria-label="Search users"
              />
              <select
                id="admin-role-filter"
                className="admin-select"
                value={userRoleFilter}
                onChange={e => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                aria-label="Filter by role"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
              <select
                id="admin-status-filter"
                className="admin-select"
                value={userStatusFilter}
                onChange={e => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            {usersLoading ? (
              <div className="admin-loading"><div className="admin-spinner" /><span>Loading users…</span></div>
            ) : users.length === 0 ? (
              <div className="admin-empty">No users found matching your filters.</div>
            ) : (
              <>
                <div className="admin-table-wrapper">
                  <table className="admin-table" aria-label="Users table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} className={!u.isActive ? 'admin-table-row--disabled' : ''}>
                          <td className="admin-td-name">{u.fullName}</td>
                          <td className="admin-td-email">{u.email}</td>
                          <td><RoleBadge role={u.role} /></td>
                          <td><StatusBadge active={u.isActive} /></td>
                          <td className="admin-td-date">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              id={`admin-toggle-user-${u._id}`}
                              className={`admin-toggle-btn ${u.isActive ? 'admin-toggle-btn--disable' : 'admin-toggle-btn--enable'}`}
                              onClick={() => handleToggleUser(u._id)}
                              disabled={togglingId === u._id}
                              aria-label={`${u.isActive ? 'Disable' : 'Enable'} ${u.fullName}`}
                            >
                              {togglingId === u._id ? '…' : u.isActive ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {userPagination && userPagination.pages > 1 && (
                  <div className="admin-pagination">
                    <button
                      id="admin-users-prev-btn"
                      className="admin-page-btn"
                      disabled={userPage <= 1}
                      onClick={() => setUserPage(p => p - 1)}
                    >
                      ← Prev
                    </button>
                    <span className="admin-page-info">Page {userPage} of {userPagination.pages}</span>
                    <button
                      id="admin-users-next-btn"
                      className="admin-page-btn"
                      disabled={userPage >= userPagination.pages}
                      onClick={() => setUserPage(p => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ── Audit Logs Tab ──────────────────────────────────────────── */}
        {activeTab === 'audit' && (
          <section className="admin-section" aria-label="Audit logs">
            <div className="admin-section-header">
              <h1 className="admin-section-title">System Audit Log</h1>
              <span className="admin-total-label">{logPagination?.total ?? 0} entries</span>
            </div>

            {/* Filters */}
            <div className="admin-filters">
              <select
                id="admin-log-status-filter"
                className="admin-select"
                value={logStatus}
                onChange={e => { setLogStatus(e.target.value); setLogPage(1); }}
                aria-label="Filter logs by status"
              >
                <option value="">All Statuses</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>

            {logsLoading ? (
              <div className="admin-loading"><div className="admin-spinner" /><span>Loading audit logs…</span></div>
            ) : logs.length === 0 ? (
              <div className="admin-empty">
                <span style={{ fontSize: '32px' }}>📋</span>
                <p>No audit logs found.</p>
              </div>
            ) : (
              <>
                <div className="admin-table-wrapper">
                  <table className="admin-table" aria-label="Audit logs table">
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Actor</th>
                        <th>Resource</th>
                        <th>Status</th>
                        <th>IP</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log._id}>
                          <td>
                            <span className="admin-log-action">{log.action.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="admin-td-email">
                            {log.actorId ? `${log.actorId.fullName} (${log.actorId.role})` : log.actorRole || 'system'}
                          </td>
                          <td>
                            <span className="admin-log-resource">{log.resource}</span>
                            {log.resourceId && (
                              <code className="admin-log-resource-id">{log.resourceId.slice(-8)}</code>
                            )}
                          </td>
                          <td>
                            <span className={`admin-log-status admin-log-status--${log.status}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="admin-td-date">{log.ipAddress || '—'}</td>
                          <td className="admin-td-date">{formatDate(log.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {logPagination && logPagination.pages > 1 && (
                  <div className="admin-pagination">
                    <button
                      id="admin-logs-prev-btn"
                      className="admin-page-btn"
                      disabled={logPage <= 1}
                      onClick={() => setLogPage(p => p - 1)}
                    >
                      ← Prev
                    </button>
                    <span className="admin-page-info">Page {logPage} of {logPagination.pages}</span>
                    <button
                      id="admin-logs-next-btn"
                      className="admin-page-btn"
                      disabled={logPage >= logPagination.pages}
                      onClick={() => setLogPage(p => p + 1)}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
