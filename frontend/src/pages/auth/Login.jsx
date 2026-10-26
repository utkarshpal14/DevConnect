import React, { useState, useEffect } from 'react';
import './auth.css';
import { loginUser, getErrorMessage } from './authService.js';
import { validateLoginForm, validateEmail } from './validator.js';
import { saveToken, saveUser, getAuthData, saveFormDraft, getFormDraft, clearFormDraft } from './storage.js';

export default function Login({ onNavigate, onLoginSuccess }) {
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

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      }, 1200);

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
    <div className="auth-page">
      <main className="auth-card" role="main">
        {/* Brand Header */}
        <header className="auth-brand">
          <div className="auth-brand-icon">⚡</div>
          <span className="auth-brand-name">DevConnect</span>
        </header>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Enter your credentials to access your account</p>

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
              onNavigate('register');
            }}
          >
            Create one here
          </a>
        </footer>
      </main>
    </div>
  );
}
