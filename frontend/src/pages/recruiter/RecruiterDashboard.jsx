import React, { useState, useEffect } from 'react';
import './recruiter.css';
import CompanyProfile from './CompanyProfile.jsx';
import JobFormModal from './JobFormModal.jsx';
import JobApplicantsModal from '../../components/applications/JobApplicantsModal.jsx';
import {
  getRecruiterProfile,
  getRecruiterJobs,
  createJob,
  updateJob,
  deleteJob,
  closeJob
} from './recruiterService.js';

export default function RecruiterDashboard({ user, onLogout, onBrowseJobs }) {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'profile' | 'overview'
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [applicantsJob, setApplicantsJob] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, jobsData] = await Promise.allSettled([
        getRecruiterProfile(),
        getRecruiterJobs()
      ]);

      if (profileData.status === 'fulfilled') {
        setProfile(profileData.value);
      }
      if (jobsData.status === 'fulfilled' && jobsData.value) {
        setJobs(jobsData.value.jobs || []);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateJob = async (jobData, jobId) => {
    setStatusMsg({ type: '', text: '' });
    if (jobId) {
      const updated = await updateJob(jobId, jobData);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? updated : j)));
      setStatusMsg({ type: 'success', text: 'Job posting updated successfully.' });
    } else {
      const created = await createJob(jobData);
      setJobs((prev) => [created, ...prev]);
      setStatusMsg({ type: 'success', text: 'New job opportunity published.' });
    }
  };

  const handleCloseJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to mark this job as Closed?')) return;
    try {
      const updated = await closeJob(jobId);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? updated : j)));
      setStatusMsg({ type: 'success', text: 'Job closed successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to close job.' });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting permanently?')) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      setStatusMsg({ type: 'success', text: 'Job posting removed.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete job.' });
    }
  };

  const openNewJobModal = () => {
    if (!profile?.companyName) {
      alert('Please set up your Company Profile before posting jobs.');
      setActiveTab('profile');
      return;
    }
    setEditingJob(null);
    setModalOpen(true);
  };

  const openEditJobModal = (job) => {
    setEditingJob(job);
    setModalOpen(true);
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'Open').length;
  const closedJobsCount = jobs.filter((j) => j.status === 'Closed').length;

  return (
    <div className="recruiter-app">
      <div className="recruiter-container">
        {/* Header */}
        <header className="recruiter-header">
          <div>
            <span className="recruiter-kicker">TALENT ACQUISITION WORKSPACE / 2026</span>
            <h1>{profile?.companyName ? profile.companyName : 'Recruitment Portal'}</h1>
            <p>
              Welcome back, {user.fullName}. Post roles, evaluate candidate match signals, and manage recruitment pipeline.
            </p>
          </div>
          <div className="recruiter-nav-actions">
            {onBrowseJobs && (
              <button
                type="button"
                className="btn-action-sm"
                onClick={onBrowseJobs}
              >
                Public Job Board &rarr;
              </button>
            )}
            <button
              type="button"
              className="btn-signout"
              onClick={onLogout}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Global Feedback Banner */}
        {statusMsg.text && (
          <div className={`alert-box alert-${statusMsg.type}`}>
            {statusMsg.text}
          </div>
        )}

        {/* Top Metrics Row */}
        <div className="overview-metrics">
          <div className="metric-card">
            <span className="metric-label">Active Roles</span>
            <span className="metric-value">{activeJobsCount}</span>
            <span className="metric-desc">Open for student applications</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Total Listings</span>
            <span className="metric-value">{jobs.length}</span>
            <span className="metric-desc">{closedJobsCount} archived / closed</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Company Profile</span>
            <span className="metric-value" style={{ fontSize: '24px', paddingTop: '6px' }}>
              {profile?.companyName ? '✓ Active' : '⚠ Incomplete'}
            </span>
            <span className="metric-desc">
              {profile?.location || 'Set location and details'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="recruiter-tabs" aria-label="Dashboard views">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            My Job Postings ({jobs.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Company Profile
          </button>
        </nav>

        {/* Main Content Area */}
        {activeTab === 'jobs' && (
          <section className="panel">
            <div className="recruiter-action-bar">
              <div>
                <span className="recruiter-kicker">MANAGE OPPORTUNITIES</span>
                <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 800 }}>
                  Active & Archived Postings
                </h2>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={openNewJobModal}
              >
                + Post New Role
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--recruiter-muted)' }}>
                <span className="recruiter-kicker">Loading your job listings...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h4>No job postings yet</h4>
                <p>Create your first job or internship listing to start attracting student candidates.</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={openNewJobModal}
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="recruiter-jobs-table">
                  <thead>
                    <tr>
                      <th>Job Title & Location</th>
                      <th>Type</th>
                      <th>Required Skills</th>
                      <th>Salary / Stipend</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr key={j._id}>
                        <td className="job-title-cell">
                          <strong>{j.title}</strong>
                          <span>📍 {j.location} {j.experienceLevel ? `• ${j.experienceLevel}` : ''}</span>
                        </td>
                        <td>
                          <span className={`badge ${j.employmentType === 'Internship' ? 'badge-internship' : 'badge-fulltime'}`}>
                            {j.employmentType}
                          </span>
                        </td>
                        <td>
                          <div className="skills-pill-group">
                            {(j.requiredSkills || []).slice(0, 3).map((skill) => (
                              <span key={skill} className="skill-pill">
                                {skill}
                              </span>
                            ))}
                            {(j.requiredSkills || []).length > 3 && (
                              <span className="skill-pill" style={{ opacity: 0.7 }}>
                                +{j.requiredSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ font: '500 13px "DM Mono", monospace' }}>
                          {j.salaryRange || 'Not disclosed'}
                        </td>
                        <td>
                          <span className={`badge ${j.status === 'Open' ? 'badge-open' : 'badge-closed'}`}>
                            {j.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn-action-sm"
                              style={{ background: 'var(--recruiter-teal, #1e6353)', color: '#fff', border: 'none' }}
                              onClick={() => setApplicantsJob(j)}
                            >
                              Applicants
                            </button>
                            <button
                              type="button"
                              className="btn-action-sm"
                              onClick={() => openEditJobModal(j)}
                            >
                              Edit
                            </button>
                            {j.status === 'Open' && (
                              <button
                                type="button"
                                className="btn-action-sm btn-action-close"
                                onClick={() => handleCloseJob(j._id)}
                              >
                                Close
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn-action-sm btn-action-delete"
                              onClick={() => handleDeleteJob(j._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <CompanyProfile
            onProfileUpdated={(updated) => {
              setProfile(updated);
            }}
          />
        )}
      </div>

      {/* New / Edit Job Modal */}
      <JobFormModal
        job={editingJob}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleCreateOrUpdateJob}
      />

      {/* Applicants Review Modal */}
      <JobApplicantsModal
        job={applicantsJob}
        isOpen={Boolean(applicantsJob)}
        onClose={() => setApplicantsJob(null)}
      />
    </div>
  );
}
