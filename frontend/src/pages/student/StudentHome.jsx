import React from 'react';
import './home.css';

const quickLinks = [
  { number: '01', label: 'Profile essentials', detail: 'Tell recruiters what you do best.' },
  { number: '02', label: 'Project proof', detail: 'Show the work behind your skills.' },
  { number: '03', label: 'Career signals', detail: 'Add credentials and achievements.' }
];

export default function StudentHome({ user, onOpenPortfolio, onBrowseJobs, onViewApplications, onLogout }) {
  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-brand"><span className="home-mark">D</span><span>DevConnect</span></div>
        <div className="home-account" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBrowseJobs && (
            <button
              type="button"
              style={{ background: 'transparent', border: '1px solid var(--home-line)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
              onClick={onBrowseJobs}
            >
              Browse Jobs &rarr;
            </button>
          )}
          {onViewApplications && (
            <button
              type="button"
              style={{ background: 'var(--home-teal)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
              onClick={onViewApplications}
            >
              My Applications
            </button>
          )}
          <span>{user.fullName}</span>
          <button type="button" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <main className="home-main">
        <section className="home-intro">
          <span className="home-kicker">STUDENT DASHBOARD / 2026</span>
          <h1>Your next opportunity starts with a sharper signal.</h1>
          <p>Welcome back, {user.fullName.split(' ')[0]}. Shape a profile that makes your skills, work, and ambition easy to find.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="home-cta" type="button" onClick={onOpenPortfolio}>Open my portfolio <span>-&gt;</span></button>
            {onBrowseJobs && (
              <button
                className="home-cta"
                type="button"
                style={{ background: 'var(--home-ink)', color: '#fff' }}
                onClick={onBrowseJobs}
              >
                Browse Opportunities <span>-&gt;</span>
              </button>
            )}
            {onViewApplications && (
              <button
                className="home-cta"
                type="button"
                style={{ background: 'transparent', border: '1px solid var(--home-line)', color: 'var(--home-ink)' }}
                onClick={onViewApplications}
              >
                Track Applications <span>-&gt;</span>
              </button>
            )}
          </div>
        </section>

        <section className="home-stats" aria-label="Portfolio overview">
          <div><strong>01</strong><span>profile to build</span></div>
          <div><strong>05</strong><span>ways to stand out</span></div>
          <div><strong>∞</strong><span>room to grow</span></div>
        </section>

        <section className="home-guide">
          <div className="guide-heading"><span className="home-kicker">YOUR NEXT MOVES</span><h2>Make your work legible.</h2></div>
          <div className="guide-list">
            {quickLinks.map((item) => (
              <div className="guide-item" key={item.number}>
                <span>{item.number}</span>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.detail}</p>
                </div>
                <button type="button" aria-label={`Open portfolio at ${item.label}`} onClick={onOpenPortfolio}>-&gt;</button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
