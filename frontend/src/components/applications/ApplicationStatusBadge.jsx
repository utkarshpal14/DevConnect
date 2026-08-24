import React from 'react';

export default function ApplicationStatusBadge({ status }) {
  const getStatusConfig = (st) => {
    switch (st) {
      case 'Applied':
        return { className: 'applied', icon: '📝', label: 'Applied' };
      case 'Under Review':
        return { className: 'under-review', icon: '👀', label: 'Under Review' };
      case 'Shortlisted':
        return { className: 'shortlisted', icon: '⭐', label: 'Shortlisted' };
      case 'Selected':
        return { className: 'selected', icon: '🎉', label: 'Selected' };
      case 'Rejected':
        return { className: 'rejected', icon: '❌', label: 'Not Selected' };
      case 'Withdrawn':
        return { className: 'withdrawn', icon: '↩️', label: 'Withdrawn' };
      default:
        return { className: 'applied', icon: '📄', label: st || 'Applied' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`status-badge ${config.className}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
