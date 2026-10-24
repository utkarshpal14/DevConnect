import React, { useState, useEffect } from 'react';
import { getJobApplicants, updateApplicationStatus } from '../../pages/student/applicationService.js';
import { getJobMatchResults, matchCandidate } from '../../pages/recruiter/matchingService.js';
import ApplicationStatusBadge from './ApplicationStatusBadge.jsx';
import CandidateMatchModal from './CandidateMatchModal.jsx';

export default function JobApplicantsModal({ job, isOpen, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Milestone 6: Candidate Matching states
  const [matchResults, setMatchResults] = useState({});
  const [evaluatingStudentId, setEvaluatingStudentId] = useState(null);
  const [activeBreakdown, setActiveBreakdown] = useState(null);

  useEffect(() => {
    if (isOpen && job?._id) {
      fetchApplicantsAndMatches();
    }
  }, [isOpen, job]);

  const fetchApplicantsAndMatches = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Fetch applicants and any pre-existing match results in parallel
      const [applicantsData, existingMatches] = await Promise.all([
        getJobApplicants(job._id),
        getJobMatchResults(job._id).catch(() => [])
      ]);

      setApplicants(applicantsData || []);

      // Build dictionary of studentId -> matchResult
      const matchMap = {};
      if (Array.isArray(existingMatches)) {
        existingMatches.forEach((m) => {
          const sId = m.studentId?._id || m.studentId;
          if (sId) {
            matchMap[sId] = m;
          }
        });
      }
      setMatchResults(matchMap);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load applicants.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateMatch = async (studentId, candidateHeadline) => {
    try {
      setEvaluatingStudentId(studentId);
      setErrorMsg('');
      const data = await matchCandidate(studentId, job._id);
      setMatchResults((prev) => ({
        ...prev,
        [studentId]: data
      }));
      // Automatically show breakdown drawer upon evaluation
      setActiveBreakdown({
        matchData: data,
        headline: candidateHeadline
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to evaluate candidate match.');
    } finally {
      setEvaluatingStudentId(null);
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

  const getMatchScorePill = (match) => {
    if (!match) return null;
    const score = match.matchScore;
    let bg = '#ecfdf5';
    let text = '#047857';
    let border = '#a7f3d0';

    if (score < 50) {
      bg = '#fef2f2';
      text = '#b91c1c';
      border = '#fecaca';
    } else if (score < 75) {
      bg = '#fffbeb';
      text = '#b45309';
      border = '#fde68a';
    }

    return (
      <span
        style={{
          background: bg,
          color: text,
          border: `1px solid ${border}`,
          padding: '3px 8px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer'
        }}
        title="Click to view AI skill breakdown"
      >
        ✨ {score}% Match
      </span>
    );
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-card"
          style={{ maxWidth: '880px', width: '94%' }}
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
              <span className="app-kicker">APPLICANT MANAGEMENT & AI MATCHING</span>
              <h2 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 800 }}>
                Applicants for "{job.title}"
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--app-muted, #64706e)' }}>
                Total Applicants: <strong>{applicants.length}</strong> • Required Skills:{' '}
                <strong>{(job.requiredSkills || []).join(', ') || 'None specified'}</strong>
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
              Fetching job applicants and AI evaluations...
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
            <div style={{ overflowX: 'auto', maxHeight: '440px' }}>
              <table className="recruiter-jobs-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Candidate & Skills</th>
                    <th>AI Match</th>
                    <th>Resume</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((app) => {
                    const student = app.studentId || {};
                    const studentId = student._id || student;
                    const match = matchResults[studentId];
                    const isEvaluating = evaluatingStudentId === studentId;

                    return (
                      <tr key={app._id}>
                        <td>
                          <strong>{student.headline || 'Student Developer'}</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                            {(student.skills || []).slice(0, 4).map((sk) => (
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

                        {/* AI Match Column */}
                        <td>
                          {match ? (
                            <div
                              onClick={() =>
                                setActiveBreakdown({
                                  matchData: match,
                                  headline: student.headline
                                })
                              }
                            >
                              {getMatchScorePill(match)}
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={isEvaluating}
                              onClick={() => handleEvaluateMatch(studentId, student.headline)}
                              style={{
                                background: '#f0fdf4',
                                color: '#166534',
                                border: '1px solid #bbf7d0',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              {isEvaluating ? 'Scoring...' : '⚡ Score AI'}
                            </button>
                          )}
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
                              📄 Resume
                            </a>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>None</span>
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
                              padding: '5px 8px',
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

      {/* Candidate Match Breakdown Modal */}
      {activeBreakdown && (
        <CandidateMatchModal
          isOpen={Boolean(activeBreakdown)}
          onClose={() => setActiveBreakdown(null)}
          matchData={activeBreakdown.matchData}
          candidateHeadline={activeBreakdown.headline}
        />
      )}
    </>
  );
}
