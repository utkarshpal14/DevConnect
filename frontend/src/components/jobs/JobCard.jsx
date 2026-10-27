import React from 'react';

export default function JobCard({ job, onSelect, isSelected }) {
  const companyName = job.recruiterId?.companyName || 'Verified Recruiter';
  const companyLocation = job.recruiterId?.location || job.location || 'Remote';

  const badgeClass =
    job.employmentType === 'Internship'
      ? 'badge-internship'
      : job.employmentType === 'Full-Time'
      ? 'badge-fulltime'
      : 'badge-open';

  return (
    <article
      className={`job-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(job)}
    >
      <header className="job-card-header">
        <div className="job-card-meta">
          <span className="company-name">{companyName}</span>
          <span className="job-location">📍 {job.location || companyLocation}</span>
        </div>
        <span className={`badge ${badgeClass}`}>{job.employmentType}</span>
      </header>

      <h3 className="job-card-title">{job.title}</h3>

      <p className="job-card-snippet">
        {job.description ? `${job.description.slice(0, 140)}...` : 'No description provided.'}
      </p>

      <div className="job-card-skills">
        {(job.requiredSkills || []).slice(0, 4).map((skill) => (
          <span key={skill} className="skill-pill">
            {skill}
          </span>
        ))}
        {(job.requiredSkills || []).length > 4 && (
          <span className="skill-pill" style={{ opacity: 0.75 }}>
            +{job.requiredSkills.length - 4}
          </span>
        )}
      </div>

      <footer className="job-card-footer">
        <div className="job-card-salary">
          {job.salaryRange ? <strong>{job.salaryRange}</strong> : <span>Salary undisclosed</span>}
        </div>
        <button
          type="button"
          className="btn-view-details"
          onClick={(e) => {
            e.stopPropagation();
            onSelect && onSelect(job);
          }}
        >
          View Role &rarr;
        </button>
      </footer>
    </article>
  );
}
