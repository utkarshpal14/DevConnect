import React, { useState, useEffect } from 'react';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import StudentHome from './pages/student/StudentHome.jsx';
import StudentPortfolio from './pages/student/StudentPortfolio.jsx';
import StudentApplications from './pages/student/StudentApplications.jsx';
import CareerAdvice from './pages/student/CareerAdvice.jsx';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard.jsx';
import JobsPortal from './pages/common/JobsPortal.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import { getUser, isAuthenticated, logout } from './pages/auth/storage.js';

export default function App() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'home' | 'portfolio' | 'jobs' | 'applications' | 'career'
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize view from URL hash if authenticated, or default to home/login
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
        const hash = window.location.hash.replace('#', '');
        const validViews = ['home', 'portfolio', 'jobs', 'applications', 'career'];
        if (hash && validViews.includes(hash)) {
          setView(hash);
        } else {
          setView('home');
        }
      }
    } else {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'register') {
        setView('register');
      } else {
        setView('login');
      }
    }
  }, []);

  // Handle browser back and forward button navigation
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          setView(hash);
        } else if (isAuthenticated()) {
          setView('home');
        } else {
          setView('login');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe navigation function updating view and browser history
  const navigateTo = (targetView) => {
    setView(targetView);
    try {
      if (window.location.hash !== `#${targetView}`) {
        window.history.pushState({ view: targetView }, '', `#${targetView}`);
      }
    } catch (_) {}
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    navigateTo('home');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigateTo('login');
  };

  // Student Views with Two-Way Cross Navigation
  if (currentUser && currentUser.role === 'student') {
    if (view === 'career') {
      return (
        <CareerAdvice
          user={currentUser}
          onBack={() => navigateTo('home')}
          onOpenPortfolio={() => navigateTo('portfolio')}
          onBrowseJobs={() => navigateTo('jobs')}
          onViewApplications={() => navigateTo('applications')}
          onLogout={handleLogout}
        />
      );
    }
    if (view === 'portfolio') {
      return (
        <StudentPortfolio
          user={currentUser}
          onBack={() => navigateTo('home')}
          onBrowseJobs={() => navigateTo('jobs')}
          onViewApplications={() => navigateTo('applications')}
          onOpenCareerAdvice={() => navigateTo('career')}
          onLogout={handleLogout}
        />
      );
    }
    if (view === 'applications') {
      return (
        <StudentApplications
          user={currentUser}
          onBack={() => navigateTo('home')}
          onBrowseJobs={() => navigateTo('jobs')}
          onOpenPortfolio={() => navigateTo('portfolio')}
          onOpenCareerAdvice={() => navigateTo('career')}
          onLogout={handleLogout}
        />
      );
    }
    if (view === 'jobs') {
      return (
        <JobsPortal
          user={currentUser}
          onBack={() => navigateTo('home')}
          onOpenPortfolio={() => navigateTo('portfolio')}
          onViewApplications={() => navigateTo('applications')}
          onOpenCareerAdvice={() => navigateTo('career')}
          onLogout={handleLogout}
        />
      );
    }
    // Default: 'home'
    return (
      <StudentHome
        user={currentUser}
        onOpenPortfolio={() => navigateTo('portfolio')}
        onOpenCareerAdvice={() => navigateTo('career')}
        onBrowseJobs={() => navigateTo('jobs')}
        onViewApplications={() => navigateTo('applications')}
        onLogout={handleLogout}
      />
    );
  }

  // Recruiter Views
  if (currentUser && currentUser.role === 'recruiter') {
    if (view === 'jobs') {
      return (
        <JobsPortal
          user={currentUser}
          onBack={() => navigateTo('home')}
          onLogout={handleLogout}
        />
      );
    }
    return (
      <RecruiterDashboard
        user={currentUser}
        onBrowseJobs={() => navigateTo('jobs')}
        onLogout={handleLogout}
      />
    );
  }

  // Admin Views
  if (currentUser && currentUser.role === 'admin') {
    if (view === 'jobs') {
      return (
        <JobsPortal
          user={currentUser}
          onBack={() => navigateTo('home')}
          onLogout={handleLogout}
        />
      );
    }
    return (
      <AdminDashboard
        user={currentUser}
        onBrowseJobs={() => navigateTo('jobs')}
        onLogout={handleLogout}
      />
    );
  }

  // Fallback for Other Roles
  if (currentUser) {
    if (view === 'jobs') {
      return (
        <JobsPortal
          user={currentUser}
          onBack={() => navigateTo('home')}
          onLogout={handleLogout}
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
            lineHeight: '1.6'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Session Information:</p>
            <p style={{ margin: '0 0 4px 0' }}><strong>User ID:</strong> {currentUser._id || currentUser.id}</p>
            <p style={{ margin: '0 0 4px 0' }}><strong>Role:</strong> {currentUser.role}</p>
            <p style={{ margin: 0 }}><strong>Status:</strong> Active</p>
          </div>

          <button
            type="button"
            className="auth-btn auth-btn-primary"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </main>
      </div>
    );
  }

  // Unauthenticated Views
  if (view === 'register') {
    return (
      <Register
        onNavigate={navigateTo}
        onSuccess={() => navigateTo('login')}
        onSwitchToLogin={() => navigateTo('login')}
      />
    );
  }

  return (
    <Login
      onNavigate={navigateTo}
      onLoginSuccess={handleLoginSuccess}
      onSuccess={handleLoginSuccess}
      onSwitchToRegister={() => navigateTo('register')}
    />
  );
}
