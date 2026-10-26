import React, { useState, useEffect } from 'react';

export default function JobFormModal({ job, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employmentType: 'Full-Time',
    experienceLevel: 'Entry-Level',
    salaryRange: '',
    applicationDeadline: '',
    requiredSkills: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        description: job.description || '',
        location: job.location || '',
        employmentType: job.employmentType || 'Full-Time',
        experienceLevel: job.experienceLevel || 'Entry-Level',
        salaryRange: job.salaryRange || '',
        applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
        requiredSkills: Array.isArray(job.requiredSkills) ? [...job.requiredSkills] : []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        location: '',
        employmentType: 'Full-Time',
        experienceLevel: 'Entry-Level',
        salaryRange: '',
        applicationDeadline: '',
        requiredSkills: ['JavaScript', 'React']
      });
    }
    setErrorMsg('');
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (formData.requiredSkills.includes(trimmed)) {
      setSkillInput('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, trimmed]
    }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Job title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Job description is required.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMsg('Job location is required.');
      return;
    }
    if (formData.requiredSkills.length === 0) {
      setErrorMsg('Please add at least one required skill.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData, job?._id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{job ? 'Edit Job Posting' : 'Create New Opportunity'}</h3>
          <button className="btn-close-modal" type="button" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="job-title">Job Title *</label>
            <input
              id="job-title"
              className="form-input"
              name="title"
              type="text"
              placeholder="e.g. Junior Backend Engineer, Frontend Intern"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="job-type">Employment Type *</label>
              <select
                id="job-type"
                className="form-select"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="job-location">Location *</label>
              <input
                id="job-location"
                className="form-input"
                name="location"
                type="text"
                placeholder="e.g. Remote, Bengaluru, San Francisco"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label htmlFor="job-experience">Experience Level</label>
              <input
                id="job-experience"
                className="form-input"
                name="experienceLevel"
                type="text"
                placeholder="e.g. 0-2 Years, Entry-Level"
                value={formData.experienceLevel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="job-salary">Salary / Stipend</label>
              <input
                id="job-salary"
                className="form-input"
                name="salaryRange"
                type="text"
                placeholder="e.g. $70,000 - $90,000 / yr"
                value={formData.salaryRange}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="job-deadline">Deadline</label>
              <input
                id="job-deadline"
                className="form-input"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skill-adder">Required Skills *</label>
            <div className="skill-input-row">
              <input
                id="skill-adder"
                className="form-input"
                type="text"
                placeholder="Add a required skill (e.g. Node.js, React, Docker)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={handleAddSkill}
              >
                Add
              </button>
            </div>

            <div className="skill-tag-container">
              {formData.requiredSkills.map((skill) => (
                <span key={skill} className="skill-removable-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    title={`Remove ${skill}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="job-desc">Job Description & Responsibilities *</label>
            <textarea
              id="job-desc"
              className="form-textarea"
              name="description"
              rows={5}
              placeholder="Outline what the role entails, team structure, and prerequisites..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              className="btn-action-sm"
              style={{ padding: '10px 18px' }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : job ? 'Update Job' : 'Publish Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
