import React, { useState } from 'react';
import './auth.css';
import { registerUser, getErrorMessage } from './authService.js';
import { validateRegisterForm, validatePassword, getStrengthMeta } from './validator.js';
import { clearFormDraft } from './storage.js';

export default function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Compute password strength dynamically
  const { strength } = validatePassword(formData.password, false);
  const strengthMeta = getStrengthMeta(strength);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    const validation = validateRegisterForm({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      setAlert({ type: 'error', message: 'Please fix the highlighted fields.' });
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      });

      clearFormDraft('register');
      setAlert({
        type: 'success',
        message: 'Account created successfully! Redirecting to login...'
      });

      setTimeout(() => {
        onNavigate('login');
      }, 1500);

    } catch (err) {
      const msg = getErrorMessage(err);
      setAlert({ type: 'error', message: msg });
      if (err.status === 409) {
        setErrors((prev) => ({ ...prev, email: 'This email is already registered.' }));
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

        <h1 className="auth-title">Create an Account</h1>
        <p className="auth-subtitle">Join the developer network and placement portal</p>

        {/* Form Alert */}
        {alert && (
          <div className={`alert-box alert-${alert.type}`} role="alert">
            <span>{alert.type === 'error' ? '✕' : '✓'}</span>
            <span>{alert.message}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="field-group">
            <label htmlFor="fullName" className="field-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className={`field-input ${errors.fullName ? 'is-error' : ''}`}
                placeholder="e.g. Alex Johnson"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
            {errors.fullName && <span className="field-error">⚠ {errors.fullName}</span>}
          </div>

          {/* Email */}
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
                autoComplete="email"
                required
              />
            </div>
            {errors.email && <span className="field-error">⚠ {errors.email}</span>}
          </div>

          {/* Role Selector */}
          <div className="field-group">
            <label className="field-label">I am joining as</label>
            <div className="role-selector" role="radiogroup">
              <div className="role-option">
                <input
                  type="radio"
                  id="role-student"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                />
                <label htmlFor="role-student" className="role-label">
                  <span className="role-icon">🎓</span>
                  <span className="role-text">Student</span>
                </label>
              </div>

              <div className="role-option">
                <input
                  type="radio"
                  id="role-recruiter"
                  name="role"
                  value="recruiter"
                  checked={formData.role === 'recruiter'}
                  onChange={handleChange}
                />
                <label htmlFor="role-recruiter" className="role-label">
                  <span className="role-icon">💼</span>
                  <span className="role-text">Recruiter</span>
                </label>
              </div>
            </div>
            {errors.role && <span className="field-error">⚠ {errors.role}</span>}
          </div>

          {/* Password */}
          <div className="field-group">
            <label htmlFor="password" className="field-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`field-input ${errors.password ? 'is-error' : ''}`}
                placeholder="Min. 8 chars, uppercase, number"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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

            {/* Password Strength Meter */}
            <div className="strength-bar-wrapper">
              <div className="strength-bar-track">
                <div
                  className="strength-bar-fill"
                  style={{
                    width: `${strengthMeta.percent}%`,
                    background: strengthMeta.color
                  }}
                ></div>
              </div>
              <div className="strength-label" style={{ color: strengthMeta.color }}>
                {strengthMeta.label}
              </div>
            </div>
            {errors.password && <span className="field-error">⚠ {errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="field-group">
            <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`field-input ${errors.confirmPassword ? 'is-error' : ''}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                aria-label="Toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👁'}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">⚠ {errors.confirmPassword}</span>}
          </div>

          {/* Terms Agreement */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeTerms">I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms & Conditions</a></label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <footer className="auth-footer">
          Already have an account?{' '}
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('login');
            }}
          >
            Sign in here
          </a>
        </footer>
      </main>
    </div>
  );
}
