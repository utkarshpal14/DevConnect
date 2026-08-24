import React, { useState, useEffect } from 'react';
import './jobs.css';
import JobCard from '../../components/jobs/JobCard.jsx';
import JobFilters from '../../components/jobs/JobFilters.jsx';
import { getJobs, getJobById } from './jobService.js';

export default function JobsPortal({ user, onBack, onApply }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    employmentType: '',
    page: 1,
    limit: 10
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchJobListings();
  }, [filters]);

  const fetchJobListings = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await getJobs(filters);
      if (data) {
        setJobs(data.jobs || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
        // Auto-select first job if none selected and jobs exist
        if ((!selectedJob || !data.jobs.find((j) => j._id === selectedJob._id)) && data.jobs?.length > 0) {
          setSelectedJob(data.jobs[0]);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch job opportunities.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = async (job) => {
    setSelectedJob(job);
    try {
      const detailed = await getJobById(job._id);
      if (detailed) {
        setSelectedJob(detailed);
      }
    } catch (err) {
      // Keep existing job data if detail request fails
      console.warn('Could not fetch extra details:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: '',
      employmentType: '',
      page: 1,
      limit: 10
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="jobs-portal">
      <div className="jobs-container">
        {/* Nav Header */}
        <header className="jobs-nav-header">
          <div className="jobs-brand-group">
            {onBack && (
              <button type="button" className="jobs-back-btn" onClick={onBack}>
                &larr; Back to Dashboard
              </button>
            )}
            <span className="recruiter-kicker" style={{ color: 'var(--job-teal)' }}>
              DEVCONNECT CAREER DISCOVERY
            </span>
          </div>
          {user && (
            <div style={{ font: '600 13px "DM Mono", monospace', color: 'var(--job-muted)' }}>
              Browsing as <strong style={{ color: 'var(--job-ink)' }}>{user.fullName}</strong>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="jobs-hero">
          <h1>Find your next engineering role or internship.</h1>
          <p>
            Explore verified opportunities from top tech teams, campus recruiters, and high-growth startups.
          </p>
        </section>

        {/* Search & Filter Controls */}
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={pagination.total}
        />

        {errorMsg && (
          <div className="alert-box alert-error" style={{ marginBottom: '20px' }}>
            {errorMsg}
          </div>
        )}

        {/* Content Layout */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--job-muted)' }}>
            <span className="recruiter-kicker" style={{ color: 'var(--job-teal)' }}>
              Searching active opportunities...
            </span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--job-panel)', borderRadius: '8px', border: '1px solid var(--job-line)' }}>
            <div className="empty-state-icon">🔍</div>
            <h4>No opportunities matched your search</h4>
            <p>Try clearing some filters or searching for broader keywords like 'React', 'Node', or 'Remote'.</p>
            <button
              type="button"
              className="btn-action-sm"
              style={{ background: '#fff', border: '1px solid var(--job-ink)', padding: '8px 16px' }}
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="jobs-main-layout">
            {/* Left Column: Job Cards List */}
            <div className="jobs-single-column">
              {jobs.map((j) => (
                <JobCard
                  key={j._id}
                  job={j}
                  isSelected={selectedJob?._id === j._id}
                  onSelect={handleSelectJob}
                />
              ))}

              {/* Pagination Bar */}
              {pagination.pages > 1 && (
                <div className="jobs-pagination">
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={pagination.page <= 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    &larr; Previous
                  </button>
                  <span className="page-indicator">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    type="button"
                    className="pagination-btn"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Job Detail Panel */}
            {selectedJob && (
              <aside className="job-detail-sticky">
                <header className="detail-header">
                  <span className="recruiter-kicker" style={{ color: 'var(--job-teal)' }}>
                    {selectedJob.recruiterId?.companyName || 'Verified Company'}
                  </span>
                  <h2>{selectedJob.title}</h2>

                  <div className="detail-meta-row">
                    <span>📍 {selectedJob.location}</span>
                    <span>💼 {selectedJob.employmentType}</span>
                    {selectedJob.experienceLevel && <span>🎓 {selectedJob.experienceLevel}</span>}
                    {selectedJob.salaryRange && <span>💰 {selectedJob.salaryRange}</span>}
                  </div>
                </header>

                <div className="detail-section">
                  <h4>Required Tech Stack & Skills</h4>
                  <div className="skills-pill-group">
                    {(selectedJob.requiredSkills || []).map((skill) => (
                      <span key={skill} className="skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Role Overview & Requirements</h4>
                  <div className="detail-description">
                    {selectedJob.description}
                  </div>
                </div>

                {selectedJob.applicationDeadline && (
                  <div className="detail-section" style={{ font: '500 12px "DM Mono", monospace', color: 'var(--job-coral)' }}>
                    ⏰ Application Deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                  </div>
                )}

                {user?.role === 'student' && (
                  <button
                    type="button"
                    className="btn-apply-job"
                    onClick={() => {
                      if (onApply) {
                        onApply(selectedJob);
                      } else {
                        alert(`Application for "${selectedJob.title}" recorded! (Milestone 4 Application Management)`);
                      }
                    }}
                  >
                    Apply for this Role &rarr;
                  </button>
                )}
              </aside>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
