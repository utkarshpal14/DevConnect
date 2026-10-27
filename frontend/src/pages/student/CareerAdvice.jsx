import React, { useState, useEffect, useCallback } from 'react';
import './careerAdvice.css';
import { analyzeSkillGap, addSkillToProfile } from './careerService.js';
import NotificationBell from '../../components/notifications/NotificationBell.jsx';

const AVAILABLE_ROLES = [
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Engineer',
  'Data Scientist',
  'DevOps Engineer'
];

export default function CareerAdvice({
  user,
  onBack,
  onOpenPortfolio,
  onBrowseJobs,
  onViewApplications,
  onLogout
}) {
  const [selectedRole, setSelectedRole] = useState('Backend Developer');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingSkill, setAddingSkill] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState(null);

  const fetchAnalysis = useCallback(async (role) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSkillGap(role);
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to analyze skill gap:', err);
      setError(err.message || 'Unable to compute skill gap analysis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis(selectedRole);
  }, [selectedRole, fetchAnalysis]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleAddSkill = async (skill) => {
    setAddingSkill(skill);
    try {
      await addSkillToProfile(skill);
      setToastMessage(`✓ Added "${skill}" to your developer profile!`);
      setTimeout(() => setToastMessage(''), 3500);
      // Re-run skill gap analysis to update readiness score immediately
      await fetchAnalysis(selectedRole);
    } catch (err) {
      console.error('Failed to add skill:', err);
      setToastMessage(`Error: ${err.message || 'Could not add skill'}`);
      setTimeout(() => setToastMessage(''), 3500);
    } finally {
      setAddingSkill(null);
    }
  };

  const score = analysis?.readinessScore || 0;
  // Calculate SVG stroke offset for 170px radius (r=70 => circumference ~ 440)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let gaugeColor = 'coral';
  let badgeClass = 'gold';
  if (score >= 80) {
    gaugeColor = 'green';
    badgeClass = 'green';
  } else if (score >= 50) {
    gaugeColor = 'teal';
    badgeClass = 'teal';
  }

  return (
    <div className="career-portal">
      <div className="career-container">
        {/* Navigation Bar */}
        <header className="career-nav-header">
          <div className="career-brand-group">
            {onBack && (
              <button
                type="button"
                className="career-back-btn"
                onClick={onBack}
                aria-label="Back to dashboard"
              >
                &larr; Dashboard
              </button>
            )}
            <div className="career-brand">
              <span className="career-mark">D</span>
              <span>DevConnect</span>
            </div>
          </div>

          <div className="career-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <NotificationBell user={user} />
            {onViewApplications && (
              <button
                type="button"
                className="career-nav-btn"
                onClick={onViewApplications}
              >
                My Applications
              </button>
            )}
            {onOpenPortfolio && (
              <button
                type="button"
                className="career-nav-btn"
                onClick={onOpenPortfolio}
              >
                My Portfolio
              </button>
            )}
            {onBrowseJobs && (
              <button
                type="button"
                className="career-nav-btn"
                onClick={onBrowseJobs}
              >
                Browse Jobs
              </button>
            )}
            {onLogout && (
              <button
                type="button"
                className="career-signout-btn"
                onClick={onLogout}
              >
                Sign out
              </button>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="career-hero">
          <span className="career-kicker">AI CAREER INTELLIGENCE / MILESTONE 5</span>
          <h1>Skill Gap Analyzer</h1>
          <p>
            Benchmark your developer profile against verified industry career tracks.
            Identify missing competencies, track your hiring readiness score, and follow prioritized learning recommendations.
          </p>

          {/* Role Selector Tabs */}
          <div className="career-role-selector-wrap">
            <span className="career-role-label">Target Track:</span>
            {AVAILABLE_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                className={`career-role-pill ${selectedRole === role ? 'active' : ''}`}
                onClick={() => handleRoleChange(role)}
              >
                <span>{selectedRole === role ? '🎯' : '💼'}</span>
                {role}
              </button>
            ))}
          </div>
        </section>

        {/* Content Area */}
        {loading ? (
          <div className="career-loading-box">
            <div className="career-spinner" />
            <p>Analyzing profile competencies against {selectedRole} taxonomy...</p>
          </div>
        ) : error ? (
          <div className="career-loading-box" style={{ color: 'var(--career-coral)' }}>
            <p>{error}</p>
            <button
              type="button"
              className="career-nav-btn"
              style={{ marginTop: '12px' }}
              onClick={() => fetchAnalysis(selectedRole)}
            >
              Retry Analysis
            </button>
          </div>
        ) : analysis ? (
          <>
            {/* Overview & Gauge Grid */}
            <div className="career-overview-grid">
              {/* Circular Gauge Card */}
              <div className="career-gauge-card">
                <div className="career-gauge-ring">
                  <svg className="career-gauge-svg" viewBox="0 0 170 170">
                    <circle
                      className="career-gauge-bg"
                      cx="85"
                      cy="85"
                      r={radius}
                    />
                    <circle
                      className={`career-gauge-fill ${gaugeColor}`}
                      cx="85"
                      cy="85"
                      r={radius}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>
                  <div className="career-gauge-inner">
                    <span className="career-gauge-pct">{score}%</span>
                    <span className="career-gauge-label">Readiness</span>
                  </div>
                </div>

                <div className={`career-status-badge ${badgeClass}`}>
                  <span>{score >= 80 ? '⚡' : score >= 50 ? '📈' : '🌱'}</span>
                  {analysis.status}
                </div>
              </div>

              {/* Role Benchmark Metadata Card */}
              <div className="career-role-meta-card">
                <div className="career-meta-header">
                  <h3>{analysis.targetRole}</h3>
                  <p>{analysis.description}</p>
                </div>

                <div className="career-stats-row">
                  <div className="career-stat-item">
                    <strong style={{ color: 'var(--career-teal)' }}>
                      {analysis.totalRequired}
                    </strong>
                    <span>Core Skills</span>
                  </div>
                  <div className="career-stat-item">
                    <strong style={{ color: 'var(--career-green)' }}>
                      {analysis.matchedCount}
                    </strong>
                    <span>Acquired</span>
                  </div>
                  <div className="career-stat-item">
                    <strong style={{ color: 'var(--career-coral)' }}>
                      {analysis.missingCount}
                    </strong>
                    <span>To Learn</span>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  {onOpenPortfolio && (
                    <button
                      type="button"
                      className="career-nav-btn"
                      style={{ background: 'var(--career-teal)', color: '#fff', borderColor: 'var(--career-teal)' }}
                      onClick={onOpenPortfolio}
                    >
                      Update Portfolio Skills &rarr;
                    </button>
                  )}
                  {onBrowseJobs && (
                    <button
                      type="button"
                      className="career-nav-btn"
                      onClick={onBrowseJobs}
                    >
                      Search Matching Jobs &rarr;
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Deep Dive Breakdown */}
            <div className="career-deep-grid">
              {/* Left Column: Skills Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Acquired Skills Card */}
                <div className="career-section-card">
                  <div className="career-section-title">
                    <h2>Acquired Skills</h2>
                    <span className="career-chip-count green">
                      {analysis.matchedCount} / {analysis.totalRequired}
                    </span>
                  </div>

                  {analysis.matchedSkills.length > 0 ? (
                    <div className="career-skills-wrap">
                      {analysis.matchedSkills.map((skill) => (
                        <span key={skill} className="career-skill-badge matched">
                          <span>✓</span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--career-muted)', fontSize: '14px', margin: 0 }}>
                      No matching skills found in your profile for this track yet. Add skills below or in your portfolio!
                    </p>
                  )}
                </div>

                {/* Missing Skills Card */}
                <div className="career-section-card">
                  <div className="career-section-title">
                    <h2>Skills to Acquire</h2>
                    <span className="career-chip-count coral">
                      {analysis.missingCount} Remaining
                    </span>
                  </div>

                  {analysis.missingSkills.length > 0 ? (
                    <div className="career-skills-wrap">
                      {analysis.missingSkills.map((skill) => (
                        <div key={skill} className="career-skill-badge missing">
                          <span>⚠️</span>
                          <span>{skill}</span>
                          <button
                            type="button"
                            className="career-add-skill-btn"
                            disabled={addingSkill === skill}
                            onClick={() => handleAddSkill(skill)}
                            title={`Add ${skill} to your portfolio skills`}
                          >
                            {addingSkill === skill ? '...' : '+ Add'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '12px 16px', background: 'var(--career-green-light)', borderRadius: '8px', color: 'var(--career-green)' }}>
                      <strong>🎉 100% Core Competencies Matched!</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
                        You have acquired every core skill for this career track.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Recommendations & Projects */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Learning Recommendations */}
                <div className="career-section-card">
                  <div className="career-section-title">
                    <h2>Prioritized Action Plan</h2>
                    <span style={{ font: '500 11px "DM Mono", monospace', color: 'var(--career-muted)' }}>
                      AI RECOMMENDATIONS
                    </span>
                  </div>

                  <div className="career-recommendations-list">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="career-rec-item">
                        <div className="career-rec-icon">
                          <span>💡</span>
                        </div>
                        <div className="career-rec-text">
                          {rec}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Projects */}
                {analysis.suggestedProjects && analysis.suggestedProjects.length > 0 && (
                  <div className="career-section-card">
                    <div className="career-section-title">
                      <h2>Suggested Capstone Projects</h2>
                      <span style={{ font: '500 11px "DM Mono", monospace', color: 'var(--career-muted)' }}>
                        PORTFOLIO BUILDERS
                      </span>
                    </div>

                    <div className="career-projects-grid">
                      {analysis.suggestedProjects.map((proj, idx) => (
                        <div key={idx} className="career-project-card">
                          <span className="career-project-badge">PROJECT #{idx + 1}</span>
                          <span>{proj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}

        {/* Toast Alert */}
        {toastMessage && (
          <div className="career-toast">
            <span>⚡</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
