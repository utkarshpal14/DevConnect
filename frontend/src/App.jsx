import React, { useState, useEffect } from 'react';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import { getUser, isAuthenticated, logout } from './pages/auth/storage.js';

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'authenticated'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
        setView('authenticated');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setView('authenticated');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('login');
  };

  if (view === 'authenticated' && currentUser) {
    return (
      <div className="auth-page">
        <main className="auth-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <header className="auth-brand">
            <div className="auth-brand-icon">⚡</div>
            <span className="auth-brand-name">DevConnect</span>
          </header>

          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {currentUser.role === 'student' ? '🎓' : '💼'}
          </div>

          <h1 className="auth-title">Welcome, {currentUser.fullName}!</h1>
          <p className="auth-subtitle" style={{ marginBottom: '20px' }}>
            Logged in as <strong style={{ color: 'var(--accent-blue)', textTransform: 'capitalize' }}>{currentUser.role}</strong> ({currentUser.email})
          </p>

          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'left',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>User ID: </span>
              <code>{currentUser._id}</code>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status: </span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active Session (JWT Stored)</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Next Slices: </span>
              <span>Student Portfolio (M2) & Recruiter Jobs (M3)</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-submit"
            style={{ background: 'rgba(248, 81, 73, 0.15)', border: '1px solid var(--border-error)', color: '#ff7b72', boxShadow: 'none' }}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </main>
      </div>
    );
  }

  return (
    <div>
      {view === 'login' ? (
        <Login
          onNavigate={(targetView) => setView(targetView)}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Register
          onNavigate={(targetView) => setView(targetView)}
        />
      )}
    </div>
  );
}
