import React from 'react';
import ApplicationStatusBadge from './ApplicationStatusBadge.jsx';

export default function ApplicationCard({ application, isSelected, onSelect, onWithdrawClick }) {
  const job = application.jobId || {};
  const isWithdrawn = application.status === 'Withdrawn';
  const isFinal = application.status === 'Selected' || application.status === 'Rejected';
  const canWithdraw = !isWithdrawn && !isFinal;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`application-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(application)}
    >
      <header className="app-card-header">
        <span className="app-card-company">
          🏢 {job.recruiterId?.companyName || 'Verified Recruiter'}
        </span>
        <ApplicationStatusBadge status={application.status} />
      </header>

      <h3 className="app-card-title">{job.title || 'Position Unavailable'}</h3>

      <div className="app-card-meta-row">
        {job.location && <span>📍 {job.location}</span>}
        {job.employmentType && <span>💼 {job.employmentType}</span>}
      </div>

      <footer className="app-card-footer">
        <span className="app-card-date">
          Applied on {formatDate(application.appliedAt)}
        </span>

        {canWithdraw && (
          <button
            type="button"
            className="btn-withdraw-sm"
            onClick={(e) => {
              e.stopPropagation();
              onWithdrawClick(application);
            }}
          >
            Withdraw Application
          </button>
        )}
      </footer>
    </div>
  );
}
