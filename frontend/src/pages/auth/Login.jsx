import React, { useState, useEffect } from 'react';
import './auth.css';
import { loginUser, getErrorMessage } from './authService.js';
import { validateLoginForm, validateEmail } from './validator.js';
import { saveToken, saveUser, getAuthData, saveFormDraft, getFormDraft, clearFormDraft } from './storage.js';

export default function Login({ onNavigate, onLoginSuccess, onSuccess, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: true
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null); // { type: 'error' | 'success', message: '' }
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    const draft = getFormDraft('login');
    if (draft) {
      setFormData((prev) => ({
        ...prev,
        email: draft.email || '',
        remember: typeof draft.remember === 'boolean' ? draft.remember : true
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      saveFormDraft('login', { email: updated.email, remember: updated.remember });
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setAlert(null);
  };

  const handleBlur = (e) => {
    if (e.target.name === 'email' && formData.email.trim()) {
      const result = validateEmail(formData.email);
      if (!result.valid) {
        setErrors((prev) => ({ ...prev, email: result.error }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const validation = validateLoginForm({
      email: formData.email.trim(),
      password: formData.password
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      setAlert({ type: 'error', message: 'Please fix the errors below.' });
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password
      });

      const { token, user } = response.data;
      saveToken(token, formData.remember);
      saveUser(user);
      clearFormDraft('login');

      setAlert({ type: 'success', message: `Welcome back, ${user.fullName}! Redirecting...` });

      const callback = onLoginSuccess || onSuccess;
      setTimeout(() => {
        if (callback) {
          callback(user);
        } else if (onNavigate) {
          onNavigate('home');
        }
      }, 800);

    } catch (err) {
      const msg = getErrorMessage(err);
      setAlert({ type: 'error', message: msg });
      if (err.status === 401) {
        setErrors((prev) => ({ ...prev, password: 'Invalid credentials' }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-3d-scene">
      {/* 3D Ambient Perspective Background */}
      <div className="scene-ambient-layer" aria-hidden="true">
        <div className="mesh-grid-3d"></div>
        <div className="floating-ring-3d ring-1"></div>
        <div className="floating-ring-3d ring-2"></div>
        <div className="ambient-glow glow-cyan"></div>
        <div className="ambient-glow glow-emerald"></div>
      </div>

      {/* Floating 3D Holograms Describing DevConnect */}
      <div className="hologram-stage" aria-hidden="true">
        {/* Hologram 1: AI Resume Parser */}
        <aside className="holo-float holo-float-left">
          <div className="holo-glass-card">
            <div className="holo-status">
              <span className="live-pulse-dot"></span>
              <span>AI ENGINE • ACTIVE</span>
            </div>
            <div className="holo-title-row">
              <span className="holo-icon-badge">⚡</span>
              <h4>AI Resume Parser</h4>
            </div>
            <p>One-click PDF extraction directly synchronizing verified technical skills, GitHub projects, and certifications.</p>
            <div className="holo-scan-bar">
              <div className="holo-scan-fill"></div>
            </div>
          </div>
        </aside>

        {/* Hologram 2: Smart Candidate Matching */}
        <aside className="holo-float holo-float-right">
          <div className="holo-glass-card">
            <div className="holo-status">
              <span className="live-pulse-dot emerald"></span>
              <span>AI MATCH ENGINE</span>
            </div>
            <div className="holo-title-row">
              <span className="holo-icon-badge">🎯</span>
              <h4>Smart Candidate Match</h4>
            </div>
            <p>Real-time skill-gap analysis aligns student competencies with recruiter requirements with 94%+ fit accuracy.</p>
            <div className="holo-tags-row">
              <span className="holo-tag">PostgreSQL</span>
              <span className="holo-tag">FastAPI</span>
              <span className="holo-tag">React</span>
            </div>
          </div>
        </aside>

        {/* Hologram 3: Bottom Signal Bar */}
        <aside className="holo-float holo-float-bottom">
          <div className="holo-glass-pill">
            <span className="pill-dot">🚀</span>
            <span>DevConnect • Verified Developer Portfolios & Campus Recruitment</span>
            <span className="pill-badge">v2.0 LIVE</span>
          </div>
        </aside>
      </div>

      {/* Central 3D Glassmorphic Auth Card */}
      <main className="auth-card auth-3d-card" role="main">
        {/* Brand Header */}
        <header className="auth-brand">
          <div className="auth-brand-icon" style={{ background: '#22634d', color: '#ffffff', fontWeight: 800 }}>D</div>
          <span className="auth-brand-name">DevConnect</span>
        </header>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your developer portfolio & recruitment portal</p>

        {/* Form-level Alert */}
        {alert && (
          <div className={`alert-box alert-${alert.type}`} role="alert">
            <span>{alert.type === 'error' ? '✕' : '✓'}</span>
            <span>{alert.message}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="field-group">
            <label htmlFor="email" className="field-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email"
                id="email"
                name="email"
                className={`field-input ${errors.email ? 'is-error' : ''}`}
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="field-error">⚠ {errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" className="field-label">Password</label>
              <a href="#" className="forgot-link" tabIndex="-1" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`field-input ${errors.password ? 'is-error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span className="field-error">⚠ {errors.password}</span>}
          </div>

          {/* Remember Me */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label htmlFor="remember">Remember me on this device</label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <footer className="auth-footer">
          Don't have an account?{' '}
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              if (onSwitchToRegister) {
                onSwitchToRegister();
              } else if (onNavigate) {
                onNavigate('register');
              }
            }}
          >
            Create one here
          </a>
        </footer>
      </main>
    </div>
  );
}
