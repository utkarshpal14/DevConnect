import React from 'react';

export default function JobFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults
}) {
  const employmentTypes = ['All', 'Internship', 'Full-Time', 'Part-Time', 'Contract'];

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <div className="job-filters-bar">
      <div className="search-inputs-grid">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by job title, skill (e.g. React, Python), or keywords..."
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
          {filters.search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => handleInputChange('search', '')}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className="location-box">
          <span className="search-icon">📍</span>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Filter location (e.g. Remote, Bengaluru)..."
            value={filters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
          {filters.location && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => handleInputChange('location', '')}
              aria-label="Clear location filter"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="type-chips-row">
        <div className="chips-group">
          {employmentTypes.map((type) => {
            const isSelected =
              type === 'All' ? !filters.employmentType : filters.employmentType === type;
            return (
              <button
                key={type}
                type="button"
                className={`filter-chip ${isSelected ? 'active' : ''}`}
                onClick={() =>
                  handleInputChange('employmentType', type === 'All' ? '' : type)
                }
              >
                {type}
              </button>
            );
          })}
        </div>

        <div className="filters-meta">
          <span className="results-count">
            {typeof totalResults === 'number' ? `${totalResults} opportunities found` : ''}
          </span>
          {(filters.search || filters.location || filters.employmentType) && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={onReset}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
