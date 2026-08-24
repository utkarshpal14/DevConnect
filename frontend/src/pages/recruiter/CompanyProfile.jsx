import React, { useState, useEffect } from 'react';
import { getRecruiterProfile, saveRecruiterProfile } from './recruiterService.js';

export default function CompanyProfile({ onProfileUpdated }) {
  const [profile, setProfile] = useState({
    companyName: '',
    companyWebsite: '',
    companyDescription: '',
    companyLogoUrl: '',
    location: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getRecruiterProfile();
      if (data) {
        setProfile({
          companyName: data.companyName || '',
          companyWebsite: data.companyWebsite || '',
          companyDescription: data.companyDescription || '',
          companyLogoUrl: data.companyLogoUrl || '',
          location: data.location || ''
        });
      }
    } catch (err) {
      // If 404, it means profile hasn't been initialized yet
      if (err.status !== 404) {
        setStatusMsg({ type: 'error', text: err.message || 'Could not load company profile.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!profile.companyName.trim()) {
      setStatusMsg({ type: 'error', text: 'Company name is required.' });
      return;
    }

    try {
      setSaving(true);
      const updated = await saveRecruiterProfile(profile);
      setStatusMsg({ type: 'success', text: 'Company profile saved successfully!' });
      if (onProfileUpdated) onProfileUpdated(updated);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save company profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '40px' }}>
        <span className="recruiter-kicker">Loading company profile...</span>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <span className="recruiter-kicker">IDENTITY & CREDENTIALS</span>
          <h2>Company Profile</h2>
        </div>
      </div>

      {statusMsg.text && (
        <div className={`alert-box alert-${statusMsg.type}`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="company-name">Company Name *</label>
            <input
              id="company-name"
              className="form-input"
              name="companyName"
              type="text"
              placeholder="e.g. Acme Innovations, Stripe, Google"
              value={profile.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-website">Company Website</label>
            <input
              id="company-website"
              className="form-input"
              name="companyWebsite"
              type="url"
              placeholder="https://example.com"
              value={profile.companyWebsite}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="company-location">Headquarters / Location</label>
            <input
              id="company-location"
              className="form-input"
              name="location"
              type="text"
              placeholder="e.g. San Francisco, CA | Remote"
              value={profile.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-logo">Company Logo URL</label>
            <input
              id="company-logo"
              className="form-input"
              name="companyLogoUrl"
              type="url"
              placeholder="https://example.com/logo.png"
              value={profile.companyLogoUrl}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="company-desc">Company About & Mission</label>
          <textarea
            id="company-desc"
            className="form-textarea"
            name="companyDescription"
            rows={4}
            placeholder="Tell candidates about your company's product, mission, culture, and team..."
            value={profile.companyDescription}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
