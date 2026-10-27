import React, { useState, useRef } from 'react';
import './resumeUpload.css';
import {
  parseResume,
  addSkillToProfile,
  updateStudentProfile,
  addProjectToProfile,
  addCertificationToProfile
} from '../../services/resumeService.js';

export default function ResumeUploadModal({
  isOpen = false,
  onClose = () => {},
  onSuccess = () => {}
}) {
  const [step, setStep] = useState('upload'); // 'upload' | 'parsing' | 'review' | 'confirmed'
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      selectFile(e.target.files[0]);
    }
  };

  const selectFile = (selectedFile) => {
    setError(null);
    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setError('Invalid format. Please select a PDF file (.pdf).');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File exceeds 5MB. Please upload a smaller PDF resume.');
      return;
    }
    setFile(selectedFile);
  };

  const handleStartParsing = async () => {
    if (!file) {
      setError('Please select a resume file first.');
      return;
    }

    setStep('parsing');
    setError(null);

    try {
      const data = await parseResume(file);
      setParsedData(data);
      setStep('review');
    } catch (err) {
      setError(err.message || 'Unable to parse resume. Please check the file and try again.');
      setStep('upload');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      skills: parsedData.skills.filter((s) => s !== skillToRemove)
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim() || !parsedData) return;
    const skillName = newSkillInput.trim();
    if (!parsedData.skills.includes(skillName)) {
      setParsedData({
        ...parsedData,
        skills: [...parsedData.skills, skillName]
      });
    }
    setNewSkillInput('');
  };

  const handleConfirmAndSync = async () => {
    if (!parsedData) return;

    setSyncing(true);
    setSyncStatus('Synchronizing verified skills to your portfolio...');

    try {
      // 1. Add skills to student profile
      if (Array.isArray(parsedData.skills) && parsedData.skills.length > 0) {
        for (const skill of parsedData.skills) {
          try {
            await addSkillToProfile(skill);
          } catch {
            // Ignore duplicates or minor skill conflict
          }
        }
      }

      // 2. Sync profile details: headline, education (with branch), and social links
      const profilePayload = {};
      if (parsedData.headline) profilePayload.headline = parsedData.headline;
      if (parsedData.githubUrl) profilePayload.githubUrl = parsedData.githubUrl;
      if (parsedData.linkedinUrl) profilePayload.linkedinUrl = parsedData.linkedinUrl;

      if (parsedData.education) {
        profilePayload.education = {
          institution: parsedData.education.institution || '',
          degree: parsedData.education.degree || '',
          branch: parsedData.education.branch || parsedData.education.fieldOfStudy || '',
          graduationYear: parsedData.education.graduationYear ? Number(parsedData.education.graduationYear) : undefined
        };
      }

      if (Object.keys(profilePayload).length > 0) {
        setSyncStatus('Updating profile and education details...');
        try {
          await updateStudentProfile(profilePayload);
        } catch {
          // Non-blocking
        }
      }

      // 3. Sync detected projects
      if (Array.isArray(parsedData.projects) && parsedData.projects.length > 0) {
        setSyncStatus('Adding detected projects to portfolio...');
        for (const proj of parsedData.projects) {
          if (proj.title && proj.description) {
            try {
              await addProjectToProfile({
                title: proj.title,
                description: proj.description,
                techStack: Array.isArray(proj.techStack) && proj.techStack.length > 0
                  ? proj.techStack
                  : (Array.isArray(proj.technologies) ? proj.technologies : [])
              });
            } catch {
              // Ignore individual project error
            }
          }
        }
      }

      // 4. Sync detected certifications
      if (Array.isArray(parsedData.certifications) && parsedData.certifications.length > 0) {
        setSyncStatus('Adding certifications...');
        for (const cert of parsedData.certifications) {
          const certTitle = typeof cert === 'string' ? cert : cert.title;
          if (certTitle) {
            let issuer = 'Certification Authority';
            if (/azure|microsoft/i.test(certTitle)) issuer = 'Microsoft';
            else if (/aws|amazon/i.test(certTitle)) issuer = 'Amazon Web Services';
            else if (/google/i.test(certTitle)) issuer = 'Google';
            else if (/cisco/i.test(certTitle)) issuer = 'Cisco';

            try {
              await addCertificationToProfile({
                title: certTitle,
                issuer: (typeof cert === 'object' && cert.issuer) ? cert.issuer : issuer
              });
            } catch {
              // Ignore individual cert error
            }
          }
        }
      }

      setStep('confirmed');
      onSuccess(parsedData);
    } catch (err) {
      setError(err.message || 'Failed to sync parsed data to profile.');
    } finally {
      setSyncing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    setStep('upload');
  };

  return (
    <div className="resume-modal-overlay" onClick={onClose}>
      <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="resume-modal-header">
          <h2>
            <span>📄 AI Resume Parser</span>
            <span className="badge-ai">Milestone 7</span>
          </h2>
          <button className="resume-modal-close" type="button" onClick={onClose} aria-label="Close modal">
            {"×"}
          </button>
        </header>

        <div className="resume-modal-body">
          {error && (
            <div className="resume-error-banner">
              <span>⚠️</span>
              <div>{error}</div>
            </div>
          )}

          {/* STEP 1: UPLOAD */}
          {step === 'upload' && (
            <div>
              <div
                className={`resume-dropzone ${isDragActive ? 'drag-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div className="resume-dropzone-icon">📥</div>
                <div className="resume-dropzone-title">
                  {file ? file.name : 'Click or drag & drop your PDF resume'}
                </div>
                <div className="resume-dropzone-subtitle">
                  Supports standard single and multi-column PDF resumes up to 5MB
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
              </div>

              {file && (
                <div className="selected-file-preview">
                  <div className="selected-file-info">
                    <span>📑</span>
                    <div>
                      <div>{file.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Change File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PARSING STATE */}
          {step === 'parsing' && (
            <div className="resume-loading-state">
              <div className="resume-spinner"></div>
              <div className="resume-loading-title">Parsing Resume with AI Engine...</div>
              <div className="resume-loading-desc">
                Extracting technical skills, education timeline, and project experience
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {step === 'review' && parsedData && (
            <div>
              <div style={{ marginBottom: '16px', fontSize: '13px', color: '#475569' }}>
                Please review the extracted information below before confirming profile synchronization.
              </div>

              {/* Candidate Info Card */}
              {(parsedData.name || parsedData.email || parsedData.headline) && (
                <div className="resume-review-card">
                  <div className="meta-item-label">Candidate Details</div>
                  <div className="candidate-meta-grid">
                    {parsedData.name && (
                      <div>
                        <div className="meta-item-label">Name</div>
                        <div className="meta-item-value">{parsedData.name}</div>
                      </div>
                    )}
                    {parsedData.email && (
                      <div>
                        <div className="meta-item-label">Email</div>
                        <div className="meta-item-value">{parsedData.email}</div>
                      </div>
                    )}
                    {parsedData.phone && (
                      <div>
                        <div className="meta-item-label">Phone</div>
                        <div className="meta-item-value">{parsedData.phone}</div>
                      </div>
                    )}
                    {parsedData.headline && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div className="meta-item-label">Suggested Headline</div>
                        <div className="meta-item-value" style={{ fontWeight: 500 }}>
                          {parsedData.headline}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extracted Skills */}
              <div className="resume-review-section">
                <div className="resume-review-heading">
                  <span>Extracted Skills ({parsedData.skills.length})</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                    Click {"×"} to remove irrelevant skills
                  </span>
                </div>
                {parsedData.skills.length > 0 ? (
                  <div className="resume-skills-wrap">
                    {parsedData.skills.map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                        <button
                          type="button"
                          className="skill-chip-remove"
                          onClick={() => handleRemoveSkill(skill)}
                          title="Remove skill"
                        >
                          {"×"}
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                    No technical skills could be automatically identified. You can add skills manually below.
                  </div>
                )}

                <form onSubmit={handleAddSkill} className="add-skill-input-wrap">
                  <input
                    type="text"
                    className="add-skill-input"
                    placeholder="Add an additional skill..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                  />
                  <button type="submit" className="btn-add-skill">
                    + Add
                  </button>
                </form>
              </div>

              {/* Education Summary */}
              {parsedData.education && (
                <div className="resume-review-section">
                  <div className="resume-review-heading">
                    <span>Education Information</span>
                  </div>
                  <div className="resume-review-card">
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {parsedData.education.institution || 'University / College'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', marginTop: '2px' }}>
                      {[parsedData.education.degree, parsedData.education.fieldOfStudy]
                        .filter(Boolean)
                        .join(' in ')}
                      {parsedData.education.graduationYear && ` • Graduating ${parsedData.education.graduationYear}`}
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Summary */}
              {Array.isArray(parsedData.projects) && parsedData.projects.length > 0 && (
                <div className="resume-review-section">
                  <div className="resume-review-heading">
                    <span>Detected Projects ({parsedData.projects.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {parsedData.projects.map((proj, idx) => (
                      <div key={idx} className="resume-review-card" style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>
                          {proj.title}
                        </div>
                        {proj.description && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            {proj.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Summary */}
              {Array.isArray(parsedData.certifications) && parsedData.certifications.length > 0 && (
                <div className="resume-review-section">
                  <div className="resume-review-heading">
                    <span>Detected Certifications ({parsedData.certifications.length})</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {parsedData.certifications.map((cert, idx) => (
                      <div key={idx} className="resume-review-card" style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 500, color: '#0f172a' }}>
                        🏅 {typeof cert === 'string' ? cert : cert.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CONFIRMED STATE */}
          {step === 'confirmed' && (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
              <h3 style={{ margin: '0 0 8px', color: '#059669', fontSize: '18px' }}>
                Profile Successfully Updated!
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto 20px' }}>
                Your extracted skills and education details have been verified and applied to your DevConnect portfolio.
              </p>
              <button type="button" className="btn-primary-ai" onClick={onClose}>
                Done & Close
              </button>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        {step !== 'confirmed' && (
          <footer className="resume-modal-footer">
            {step === 'upload' && (
              <>
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-primary-ai"
                  disabled={!file}
                  onClick={handleStartParsing}
                >
                  Start AI Parsing {"→"}
                </button>
              </>
            )}

            {step === 'review' && (
              <>
                <button type="button" className="btn-secondary" onClick={handleReset} disabled={syncing}>
                  Upload Different File
                </button>
                <button
                  type="button"
                  className="btn-primary-ai"
                  disabled={syncing}
                  onClick={handleConfirmAndSync}
                >
                  {syncing ? syncStatus : '✓ Confirm & Apply to Profile'}
                </button>
              </>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
