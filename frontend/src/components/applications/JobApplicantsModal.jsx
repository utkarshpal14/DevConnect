import React, { useState, useEffect } from 'react';
import { getJobApplicants, updateApplicationStatus } from '../../pages/student/applicationService.js';
import ApplicationStatusBadge from './ApplicationStatusBadge.jsx';

export default function JobApplicantsModal({ job, isOpen, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (isOpen && job?._id) {
      fetchApplicants();
    }
  }, [isOpen, job]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await getJobApplicants(job._id);
      setApplicants(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      setErrorMsg('');
      const updated = await updateApplicationStatus(applicationId, newStatus);
      setApplicants((prev) =>
        prev.map((app) => (app._id === applicationId ? { ...app, status: updated.status } : app))
      );
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update candidate status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen || !job) return null;

  const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '820px', width: '92%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--app-line, #d8ded4)',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <span className="app-kicker">APPLICANT MANAGEMENT</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 800 }}>
              Applicants for "{job.title}"
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--app-muted, #64706e)' }}>
              Total Applicants: <strong>{applicants.length}</strong>
            </p>
          </div>
          <button
            type="button"
            className="btn-cancel"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </header>

        {errorMsg && (
          <div
            className="alert-box alert-error"
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '6px',
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              fontSize: '13px'
            }}
          >
            {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--app-muted, #64706e)' }}>
            Fetching job applicants...
          </div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--app-muted, #64706e)' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📬</div>
            <h4>No applications received yet</h4>
            <p style={{ fontSize: '13px' }}>
              Student applications for this role will appear here automatically.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: '420px' }}>
            <table className="recruiter-jobs-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Candidate Headline & Skills</th>
                  <th>Resume</th>
                  <th>Date Applied</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => {
                  const student = app.studentId || {};
                  return (
                    <tr key={app._id}>
                      <td>
                        <strong>{student.headline || 'Student Developer'}</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                          {(student.skills || []).slice(0, 3).map((sk) => (
                            <span
                              key={sk}
                              style={{
                                background: '#fff',
                                border: '1px solid var(--app-line, #d8ded4)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px'
                              }}
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td>
                        {student.resumeUrl ? (
                          <a
                            href={student.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--app-teal, #1e6353)',
                              fontWeight: 700,
                              fontSize: '12px'
                            }}
                          >
                            📄 View Resume
                          </a>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>No Resume</span>
                        )}
                      </td>

                      <td style={{ font: '500 12px "DM Mono", monospace' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>

                      <td>
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <select
                          value={app.status}
                          disabled={updatingId === app._id || app.status === 'Withdrawn'}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--app-line, #d8ded4)',
                            font: '600 12px "Manrope", sans-serif',
                            cursor: 'pointer',
                            background: '#fff'
                          }}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          {allowedStatuses.map((st) => (
                            <option key={st} value={st}>
                              Set: {st}
                            </option>
                          ))}
                          {app.status === 'Withdrawn' && <option value="Withdrawn">Withdrawn</option>}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
