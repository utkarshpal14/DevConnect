import React, { useState, useEffect } from 'react';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import StudentHome from './pages/student/StudentHome.jsx';
import StudentPortfolio from './pages/student/StudentPortfolio.jsx';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard.jsx';
import JobsPortal from './pages/common/JobsPortal.jsx';
import { getUser, isAuthenticated, logout } from './pages/auth/storage.js';

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'home' | 'portfolio' | 'jobs'
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
        setView('home');
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setView('home');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('login');
  };

  // Student Views
  if (currentUser && currentUser.role === 'student') {
    if (view === 'portfolio') {
      return <StudentPortfolio user={currentUser} onLogout={handleLogout} />;
    }
    if (view === 'jobs') {
      return (
        <JobsPortal
          user={currentUser}
          onBack={() => setView('home')}
        />
      );
    }
    if (view === 'home') {
      return (
        <StudentHome
          user={currentUser}
          onOpenPortfolio={() => setView('portfolio')}
          onBrowseJobs={() => setView('jobs')}
          onLogout={handleLogout}
        />
      );
    }
  }

  // Recruiter Views
  if (currentUser && currentUser.role === 'recruiter') {
    if (view === 'jobs') {
      return (
        <JobsPortal
          user={currentUser}
          onBack={() => setView('home')}
        />
      );
    }
    return (
      <RecruiterDashboard
        user={currentUser}
        onBrowseJobs={() => setView('jobs')}
        onLogout={handleLogout}
      />
    );
  }

  // Fallback for Admin or Other Roles
  if (currentUser) {
    if (view === 'jobs') {
      return (
        <JobsPortal
          user={currentUser}
          onBack={() => setView('home')}
        />
      );
    }
    return (
      <div className="auth-page">
        <main className="auth-card" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <header className="auth-brand">
            <div className="auth-brand-icon">⚡</div>
            <span className="auth-brand-name">DevConnect</span>
          </header>

          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            🛡️
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
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-submit"
              onClick={() => setView('jobs')}
            >
              Browse Jobs Portal &rarr;
            </button>
            <button
              type="button"
              className="btn-submit"
              style={{ background: 'rgba(248, 81, 73, 0.15)', border: '1px solid var(--border-error)', color: '#ff7b72', boxShadow: 'none' }}
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
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
