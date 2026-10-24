import React from 'react';

export default function CandidateMatchModal({ isOpen, onClose, matchData, candidateHeadline }) {
  if (!isOpen || !matchData) return null;

  const { matchScore, matchedSkills = [], missingSkills = [], jobTitle } = matchData;

  const getScoreColor = (score) => {
    if (score >= 75) return '#059669'; // Green
    if (score >= 50) return '#d97706'; // Amber
    return '#dc2626'; // Red
  };

  const getScoreBg = (score) => {
    if (score >= 75) return '#ecfdf5';
    if (score >= 50) return '#fffbeb';
    return '#fef2f2';
  };

  const scoreColor = getScoreColor(matchScore);
  const scoreBg = getScoreBg(matchScore);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                color: '#0d9488',
                textTransform: 'uppercase'
              }}
            >
              AI Candidate Evaluation
            </span>
            <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Skill Match Breakdown
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>
              {candidateHeadline || 'Candidate'} vs. <strong>{jobTitle || 'Job Requirements'}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Score Banner */}
        <div
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            borderBottom: '1px solid #f1f5f9',
            background: scoreBg
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `4px solid ${scoreColor}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
              {matchScore}%
            </span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginTop: '2px' }}>
              MATCH
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
              {matchScore >= 75
                ? 'Strong Skill Alignment 🌟'
                : matchScore >= 50
                ? 'Moderate Alignment ⚡'
                : 'Significant Skill Gap ⚠️'}
            </h4>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>
              Candidate meets <strong>{matchedSkills.length}</strong> of{' '}
              <strong>{matchedSkills.length + missingSkills.length}</strong> required competencies for this position.
            </p>
          </div>
        </div>

        {/* Breakdown Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Matched Skills */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#059669' }}>
                Matched Required Skills ({matchedSkills.length})
              </h5>
            </div>
            {matchedSkills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                No required skills matched in candidate profile.
              </p>
            )}
          </div>

          {/* Missing Skills */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px' }}>❌</span>
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>
                Missing Required Skills ({missingSkills.length})
              </h5>
            </div>
            {missingSkills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: '#fef2f2',
                      color: '#991b1b',
                      border: '1px solid #fecaca',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ✕ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '13px', color: '#059669', fontWeight: 600 }}>
                Candidate possesses all skills required for this job!
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#f8fafc'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
