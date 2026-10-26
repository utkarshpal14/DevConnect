import React, { useState, useEffect } from 'react';
import './applications.css';
import ApplicationCard from '../../components/applications/ApplicationCard.jsx';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge.jsx';
import { getMyApplications, withdrawApplication } from './applicationService.js';

export default function StudentApplications({ user, onBack, onBrowseJobs, onOpenPortfolio, onLogout }) {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'shortlisted' | 'selected' | 'archived'
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State for Withdraw Confirmation
  const [withdrawModalApp, setWithdrawModalApp] = useState(null);
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await getMyApplications();
      setApplications(data || []);
      if (data && data.length > 0) {
        setSelectedApp(data[0]);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmWithdraw = async () => {
    if (!withdrawModalApp) return;
    try {
      setSubmittingWithdraw(true);
      setErrorMsg('');
      const updated = await withdrawApplication(withdrawModalApp._id);

      // Update local state
      setApplications((prev) =>
        prev.map((item) => (item._id === withdrawModalApp._id ? { ...item, status: 'Withdrawn' } : item))
      );

      if (selectedApp && selectedApp._id === withdrawModalApp._id) {
        setSelectedApp((prev) => ({ ...prev, status: 'Withdrawn' }));
      }

      setSuccessMsg('Application withdrawn successfully.');
      setWithdrawModalApp(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to withdraw application.');
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  // Stats Calculations
  const totalCount = applications.length;
  const underReviewCount = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'Under Review'
  ).length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const selectedCount = applications.filter((a) => a.status === 'Selected').length;

  // Filter logic
  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return app.status === 'Applied' || app.status === 'Under Review';
    if (activeTab === 'shortlisted') return app.status === 'Shortlisted';
    if (activeTab === 'selected') return app.status === 'Selected';
    if (activeTab === 'archived') return app.status === 'Rejected' || app.status === 'Withdrawn';
    return true;
  });

  const getTabCount = (tabKey) => {
    switch (tabKey) {
      case 'all':
        return applications.length;
      case 'active':
        return underReviewCount;
      case 'shortlisted':
        return shortlistedCount;
      case 'selected':
        return selectedCount;
      case 'archived':
        return applications.filter((a) => a.status === 'Rejected' || a.status === 'Withdrawn').length;
      default:
        return 0;
    }
  };

  return (
    <div className="applications-portal">
      <div className="applications-container">
        {/* Top Header */}
        <header className="applications-nav-header">
          <div className="applications-brand-group">
            {onBack && (
              <button type="button" className="app-back-btn" onClick={onBack}>
                &larr; Dashboard
              </button>
            )}
            <span className="app-kicker">STUDENT CAREER TRACKER</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {onBrowseJobs && (
              <button
                type="button"
                className="app-back-btn"
                style={{ background: 'var(--app-teal)', color: '#fff', border: 'none' }}
                onClick={onBrowseJobs}
              >
                Browse Opportunities &rarr;
              </button>
            )}
            {onOpenPortfolio && (
              <button type="button" className="app-back-btn" onClick={onOpenPortfolio}>
                My Portfolio
              </button>
            )}
            {onLogout && (
              <button
                type="button"
                className="app-back-btn"
                style={{ borderColor: 'rgba(219, 111, 56, 0.4)', color: 'var(--app-coral)' }}
                onClick={onLogout}
              >
                Sign out
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="applications-hero">
          <h1>Track your application progress & status.</h1>
          <p>
            Stay updated on your job applications, recruiter status changes, and interview shortlists.
          </p>
        </section>

        {/* Alerts */}
        {errorMsg && (
          <div
            className="alert-box alert-error"
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca'
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            className="alert-box alert-success"
            style={{
              marginBottom: '20px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0'
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Stats Grid */}
        <div className="app-stats-grid">
          <div className="app-stat-card">
            <span className="app-stat-number">{totalCount}</span>
            <span className="app-stat-label">Total Applications</span>
          </div>
          <div className="app-stat-card" style={{ borderColor: 'rgba(201, 147, 38, 0.3)' }}>
            <span className="app-stat-number" style={{ color: 'var(--app-gold)' }}>
              {underReviewCount}
            </span>
            <span className="app-stat-label">Under Review</span>
          </div>
          <div className="app-stat-card" style={{ borderColor: 'rgba(107, 70, 193, 0.3)' }}>
            <span className="app-stat-number" style={{ color: 'var(--app-purple)' }}>
              {shortlistedCount}
            </span>
            <span className="app-stat-label">Shortlisted</span>
          </div>
          <div className="app-stat-card" style={{ borderColor: 'rgba(21, 128, 61, 0.3)' }}>
            <span className="app-stat-number" style={{ color: 'var(--app-green)' }}>
              {selectedCount}
            </span>
            <span className="app-stat-label">Offers / Selected</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="app-filter-tabs">
          {[
            { key: 'all', label: 'All Applications' },
            { key: 'active', label: 'Active & In Review' },
            { key: 'shortlisted', label: 'Shortlisted' },
            { key: 'selected', label: 'Offers / Selected' },
            { key: 'archived', label: 'Withdrawn & Closed' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`app-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span>{tab.label}</span>
              <span className="app-tab-count">{getTabCount(tab.key)}</span>
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--app-muted)' }}>
            <span className="app-kicker">Loading applications...</span>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="app-empty-state">
            <div className="app-empty-icon">📁</div>
            <h3>No applications found</h3>
            <p>
              {activeTab === 'all'
                ? "You haven't submitted any job applications yet. Discover open opportunities and apply with your developer portfolio."
                : `No applications currently match the "${activeTab}" filter.`}
            </p>
            {onBrowseJobs && (
              <button type="button" className="btn-browse-cta" onClick={onBrowseJobs}>
                Browse Open Positions &rarr;
              </button>
            )}
          </div>
        ) : (
          <div className="applications-main-layout">
            {/* Left Column: Application Cards */}
            <div className="applications-list-column">
              {filteredApplications.map((app) => (
                <ApplicationCard
                  key={app._id}
                  application={app}
                  isSelected={selectedApp?._id === app._id}
                  onSelect={(selected) => setSelectedApp(selected)}
                  onWithdrawClick={(appToWithdraw) => setWithdrawModalApp(appToWithdraw)}
                />
              ))}
            </div>

            {/* Right Column: Sticky Application Detail Panel */}
            {selectedApp && selectedApp.jobId && (
              <aside className="app-detail-panel">
                <header className="app-detail-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="app-kicker">
                      {selectedApp.jobId?.recruiterId?.companyName || 'Verified Company'}
                    </span>
                    <ApplicationStatusBadge status={selectedApp.status} />
                  </div>

                  <h2>{selectedApp.jobId?.title}</h2>

                  <div className="app-card-meta-row" style={{ marginTop: '8px' }}>
                    {selectedApp.jobId?.location && <span>📍 {selectedApp.jobId.location}</span>}
                    {selectedApp.jobId?.employmentType && (
                      <span>💼 {selectedApp.jobId.employmentType}</span>
                    )}
                  </div>
                </header>

                <div className="app-detail-section">
                  <h4>Application Timeline</h4>
                  <div style={{ fontSize: '13px', color: 'var(--app-muted)', lineHeight: '1.6' }}>
                    <div>
                      📅 Submitted on:{' '}
                      <strong>{new Date(selectedApp.appliedAt).toLocaleDateString()}</strong>
                    </div>
                    {selectedApp.updatedAt && (
                      <div>
                        🔄 Last Status Change:{' '}
                        <strong>{new Date(selectedApp.updatedAt).toLocaleDateString()}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="app-detail-section">
                  <h4>Role Overview</h4>
                  <div className="app-detail-text">
                    {selectedApp.jobId?.description || 'No description provided.'}
                  </div>
                </div>

                {selectedApp.jobId?.requiredSkills && (
                  <div className="app-detail-section">
                    <h4>Required Skills</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedApp.jobId.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          style={{
                            background: '#fff',
                            border: '1px solid var(--app-line)',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApp.status !== 'Withdrawn' &&
                  selectedApp.status !== 'Selected' &&
                  selectedApp.status !== 'Rejected' && (
                    <button
                      type="button"
                      className="btn-withdraw-sm"
                      style={{ width: '100%', padding: '12px', marginTop: '12px' }}
                      onClick={() => setWithdrawModalApp(selectedApp)}
                    >
                      Withdraw Application
                    </button>
                  )}
              </aside>
            )}
          </div>
        )}

        {/* Modal Confirmation for Withdraw */}
        {withdrawModalApp && (
          <div className="modal-overlay" onClick={() => setWithdrawModalApp(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Withdraw Application?</h3>
                <p>
                  Are you sure you want to withdraw your application for{' '}
                  <strong>"{withdrawModalApp.jobId?.title}"</strong>? This action will inform the
                  recruiter that you are no longer considering this position.
                </p>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  disabled={submittingWithdraw}
                  onClick={() => setWithdrawModalApp(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-danger-confirm"
                  disabled={submittingWithdraw}
                  onClick={handleConfirmWithdraw}
                >
                  {submittingWithdraw ? 'Withdrawing...' : 'Confirm Withdraw'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
