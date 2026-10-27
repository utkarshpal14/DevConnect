import React, { useEffect, useState } from 'react';
import './student.css';
import {
  addAchievement,
  addCertification,
  addProject,
  addSkill,
  getProfile,
  removeCertification,
  removeProject,
  removeSkill,
  removeAchievement,
  saveProfile,
  uploadResume
} from './studentService.js';
import ResumeUploadModal from '../../components/resume/ResumeUploadModal.jsx';
import NotificationBell from '../../components/notifications/NotificationBell.jsx';

const emptyProfile = {
  headline: '',
  bio: '',
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
  education: { institution: '', degree: '', branch: '', cgpa: '', graduationYear: '' },
  skills: [],
  projects: [],
  certifications: [],
  achievements: []
};

const errorText = (error) => error?.message || 'Something went wrong. Please try again.';

export default function StudentPortfolio({ user, onBack, onBrowseJobs, onViewApplications, onOpenCareerAdvice, onLogout }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [skill, setSkill] = useState('');
  const [project, setProject] = useState({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
  const [certification, setCertification] = useState({ title: '', issuer: '', issueDate: '', certificateUrl: '' });
  const [achievement, setAchievement] = useState({ title: '', description: '', achievementDate: '' });
  const [showResumeModal, setShowResumeModal] = useState(false);

  const reloadProfile = () => {
    getProfile()
      .then((data) => setProfile({ ...emptyProfile, ...data, education: { ...emptyProfile.education, ...(data.education || {}) } }))
      .catch((error) => setMessage({ type: 'error', text: errorText(error) }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadProfile();
  }, []);

  const notify = (type, text) => setMessage({ type, text });

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith('education.')) {
      setProfile((current) => ({ ...current, education: { ...current.education, [name.split('.')[1]]: value } }));
      return;
    }
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await saveProfile({ ...profile, education: { ...profile.education, cgpa: profile.education.cgpa ? Number(profile.education.cgpa) : undefined, graduationYear: profile.education.graduationYear ? Number(profile.education.graduationYear) : undefined } });
      setProfile((current) => ({ ...current, ...saved, education: { ...current.education, ...(saved.education || {}) } }));
      notify('success', 'Profile details saved.');
    } catch (error) {
      notify('error', errorText(error));
    } finally {
      setSaving(false);
    }
  };

  const handleResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = await uploadResume(file);
      setProfile((current) => ({ ...current, resumeUrl: data.resumeUrl }));
      notify('success', 'Resume uploaded successfully.');
    } catch (error) {
      notify('error', errorText(error));
    }
    event.target.value = '';
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    if (!skill.trim()) return;
    try {
      const data = await addSkill(skill.trim());
      setProfile((current) => ({ ...current, skills: data.skills }));
      setSkill('');
    } catch (error) { notify('error', errorText(error)); }
  };

  const handleAddProject = async (event) => {
    event.preventDefault();
    try {
      const data = await addProject({ ...project, techStack: project.techStack.split(',').map((item) => item.trim()).filter(Boolean) });
      setProfile((current) => ({ ...current, projects: data.projects }));
      setProject({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
      notify('success', 'Project added.');
    } catch (error) { notify('error', errorText(error)); }
  };

  const handleAddCertification = async (event) => {
    event.preventDefault();
    try {
      const data = await addCertification(certification);
      setProfile((current) => ({ ...current, certifications: data.certifications }));
      setCertification({ title: '', issuer: '', issueDate: '', certificateUrl: '' });
      notify('success', 'Certification added.');
    } catch (error) { notify('error', errorText(error)); }
  };

  const handleAddAchievement = async (event) => {
    event.preventDefault();
    try {
      const data = await addAchievement(achievement);
      setProfile((current) => ({ ...current, achievements: data.achievements }));
      setAchievement({ title: '', description: '', achievementDate: '' });
      notify('success', 'Achievement added.');
    } catch (error) { notify('error', errorText(error)); }
  };

  const updateCollection = async (action, id, key) => {
    try {
      const data = await action(id);
      setProfile((current) => ({ ...current, [key]: data[key] }));
      notify('success', 'Removed successfully.');
    } catch (error) { notify('error', errorText(error)); }
  };

  if (loading) return <div className="student-loading">Loading your portfolio...</div>;

  return (
    <div className="student-app">
      {/* Top Navigation Bar with Back Button and Portal Links */}
      <nav
        className="student-top-nav"
        style={{
          maxWidth: '1240px',
          margin: '0 auto 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#ffffff',
          border: '1px solid var(--line, #d9ddd4)',
          borderRadius: '8px',
          padding: '12px 18px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'transparent',
                border: '1px solid var(--line, #d9ddd4)',
                borderRadius: '6px',
                padding: '6px 12px',
                color: 'var(--green, #22634d)',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              &larr; Back to Dashboard
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '5px',
                background: 'var(--green, #22634d)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px'
              }}
            >
              D
            </span>
            <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--ink, #182022)' }}>
              DevConnect
            </span>
            <span
              style={{
                background: 'var(--mint, #c8e8d3)',
                color: 'var(--green, #22634d)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800
              }}
            >
              PORTFOLIO
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onOpenCareerAdvice && (
            <button
              type="button"
              onClick={onOpenCareerAdvice}
              style={{
                background: 'rgba(34, 99, 77, 0.08)',
                color: 'var(--green, #22634d)',
                border: '1px solid rgba(34, 99, 77, 0.2)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              AI Career Intelligence ⚡
            </button>
          )}
          {onBrowseJobs && (
            <button
              type="button"
              onClick={onBrowseJobs}
              style={{
                background: 'transparent',
                border: '1px solid var(--line, #d9ddd4)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
                color: 'var(--ink, #182022)'
              }}
            >
              Browse Jobs &rarr;
            </button>
          )}
          {onViewApplications && (
            <button
              type="button"
              onClick={onViewApplications}
              style={{
                background: 'transparent',
                border: '1px solid var(--line, #d9ddd4)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
                color: 'var(--ink, #182022)'
              }}
            >
              My Applications
            </button>
          )}
          <NotificationBell user={user} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted, #6c7775)' }}>
            {user.fullName}
          </span>
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--orange, #e47d42)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              padding: '6px 8px'
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <header className="student-header">
        <div>
          <span className="student-kicker">DEVCONNECT / PORTFOLIO</span>
          <h1>Build your signal.</h1>
          <p>Turn your work into a profile recruiters can remember.</p>
        </div>
      </header>

      <main className="student-layout">
        <section className="student-hero">
          <div className="avatar">{user.fullName?.slice(0, 1).toUpperCase()}</div>
          <div><span className="eyebrow">STUDENT PROFILE</span><h2>{user.fullName}</h2><p>{profile.headline || 'Add a headline to tell recruiters what you do best.'}</p></div>
          <div className="profile-progress"><strong>{[profile.headline, profile.bio, profile.education?.institution, profile.resumeUrl].filter(Boolean).length}/4</strong><span>profile essentials</span></div>
        </section>

        {message && <div className={`student-message ${message.type}`} role="status">{message.text}</div>}

        <section className="student-grid">
          <form className="panel profile-panel" onSubmit={handleSaveProfile}>
            <div className="panel-heading"><div><span className="eyebrow">01 / IDENTITY</span><h3>Profile details</h3></div><button className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div>
            <label>Headline<input name="headline" value={profile.headline || ''} onChange={handleProfileChange} maxLength="120" placeholder="Frontend developer focused on useful interfaces" /></label>
            <label>About you<textarea name="bio" value={profile.bio || ''} onChange={handleProfileChange} maxLength="1000" rows="5" placeholder="What are you learning, building, or looking for?" /></label>
            <div className="form-three"><label>GitHub<input name="githubUrl" value={profile.githubUrl || ''} onChange={handleProfileChange} placeholder="https://github.com/..." /></label><label>LinkedIn<input name="linkedinUrl" value={profile.linkedinUrl || ''} onChange={handleProfileChange} placeholder="https://linkedin.com/in/..." /></label><label>Portfolio<input name="portfolioUrl" value={profile.portfolioUrl || ''} onChange={handleProfileChange} placeholder="https://..." /></label></div>
            <div className="section-rule"><span>Education</span></div>
            <div className="form-two"><label>Institution<input name="education.institution" value={profile.education?.institution || ''} onChange={handleProfileChange} placeholder="University or college" /></label><label>Degree<input name="education.degree" value={profile.education?.degree || ''} onChange={handleProfileChange} placeholder="B.Tech" /></label><label>Branch<input name="education.branch" value={profile.education?.branch || ''} onChange={handleProfileChange} placeholder="Computer Science" /></label><label>Graduation year<input type="number" name="education.graduationYear" value={profile.education?.graduationYear || ''} onChange={handleProfileChange} placeholder="2027" /></label><label>CGPA<input type="number" step="0.01" min="0" max="10" name="education.cgpa" value={profile.education?.cgpa || ''} onChange={handleProfileChange} placeholder="8.5" /></label></div>
          </form>

          <aside className="panel resume-panel">
            <span className="eyebrow">QUICK ACTION</span>
            <h3>Keep your resume close.</h3>
            <p>Upload a PDF so recruiters can move from profile to proof.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                className="primary-button"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
                onClick={() => setShowResumeModal(true)}
              >
                <span>⚡ AI Resume Auto-Fill</span>
              </button>
              <label className="upload-button">
                {profile.resumeUrl ? 'Replace resume' : 'Upload raw resume'}
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResume} />
              </label>
            </div>
            {profile.resumeUrl && <a className="resume-link" href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')}${profile.resumeUrl}`} target="_blank" rel="noreferrer">View current resume -&gt;</a>}
          </aside>
        </section>

        <section className="panel collection-panel"><div className="panel-heading"><div><span className="eyebrow">02 / TOOLKIT</span><h3>Skills</h3></div><span className="count-badge">{profile.skills?.length || 0}</span></div><form className="inline-form" onSubmit={handleAddSkill}><input value={skill} onChange={(event) => setSkill(event.target.value)} placeholder="Add a skill, e.g. React" /><button className="secondary-button">Add skill</button></form><div className="tag-list">{profile.skills?.map((item) => <span className="skill-tag" key={item}>{item}<button type="button" aria-label={`Remove ${item}`} onClick={() => updateCollection(removeSkill, item, 'skills')}>x</button></span>)}</div></section>

        <section className="student-grid lower-grid"><section className="panel collection-panel"><div className="panel-heading"><div><span className="eyebrow">03 / PROOF</span><h3>Projects</h3></div><span className="count-badge">{profile.projects?.length || 0}</span></div><form className="stack-form" onSubmit={handleAddProject}><input required value={project.title} onChange={(event) => setProject({ ...project, title: event.target.value })} placeholder="Project title" /><textarea required rows="3" value={project.description} onChange={(event) => setProject({ ...project, description: event.target.value })} placeholder="What did you build and why?" /><input value={project.techStack} onChange={(event) => setProject({ ...project, techStack: event.target.value })} placeholder="Tech stack, comma separated" /><div className="form-two"><input value={project.githubUrl} onChange={(event) => setProject({ ...project, githubUrl: event.target.value })} placeholder="GitHub URL" /><input value={project.liveUrl} onChange={(event) => setProject({ ...project, liveUrl: event.target.value })} placeholder="Live URL" /></div><button className="secondary-button">Add project</button></form><div className="item-list">{profile.projects?.map((item) => <article className="list-item" key={item._id}><div><strong>{item.title}</strong><p>{item.description}</p><small>{item.techStack?.join(' / ')}</small></div><button type="button" onClick={() => updateCollection(removeProject, item._id, 'projects')}>Remove</button></article>)}</div></section>

        <section className="panel collection-panel"><div className="panel-heading"><div><span className="eyebrow">04 / CREDENTIALS</span><h3>Certifications</h3></div><span className="count-badge">{profile.certifications?.length || 0}</span></div><form className="stack-form" onSubmit={handleAddCertification}><input required value={certification.title} onChange={(event) => setCertification({ ...certification, title: event.target.value })} placeholder="Certification title" /><input required value={certification.issuer} onChange={(event) => setCertification({ ...certification, issuer: event.target.value })} placeholder="Issuing organization" /><div className="form-two"><input type="date" value={certification.issueDate} onChange={(event) => setCertification({ ...certification, issueDate: event.target.value })} /><input value={certification.certificateUrl} onChange={(event) => setCertification({ ...certification, certificateUrl: event.target.value })} placeholder="Certificate URL" /></div><button className="secondary-button">Add certification</button></form><div className="item-list">{profile.certifications?.map((item) => <article className="list-item" key={item._id}><div><strong>{item.title}</strong><p>{item.issuer}</p></div><button type="button" onClick={() => updateCollection(removeCertification, item._id, 'certifications')}>Remove</button></article>)}</div></section></section>

        <section className="panel collection-panel"><div className="panel-heading"><div><span className="eyebrow">05 / MILESTONES</span><h3>Achievements</h3></div><span className="count-badge">{profile.achievements?.length || 0}</span></div><form className="inline-achievement" onSubmit={handleAddAchievement}><input required value={achievement.title} onChange={(event) => setAchievement({ ...achievement, title: event.target.value })} placeholder="Achievement title" /><input required value={achievement.description} onChange={(event) => setAchievement({ ...achievement, description: event.target.value })} placeholder="Short description" /><input type="date" value={achievement.achievementDate} onChange={(event) => setAchievement({ ...achievement, achievementDate: event.target.value })} /><button className="secondary-button">Add</button></form><div className="tag-list achievement-list">{profile.achievements?.map((item) => <span className="achievement-tag" key={item._id}><strong>{item.title}</strong><small>{item.description}</small><button type="button" aria-label={`Remove ${item.title}`} onClick={() => updateCollection(removeAchievement, item._id, 'achievements')}>x</button></span>)}</div></section>
      </main>

      <ResumeUploadModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onSuccess={(parsed) => {
          reloadProfile();
          notify('success', 'Resume parsed! Extracted skills, education, projects, and credentials have been synced to your profile.');
        }}
      />
    </div>
  );
}
