import React, { useState, useEffect } from 'react';
import { Clock, Tag, Trash2, X, Filter } from 'lucide-react';

const QUOTES = [
  "Knowledge is power.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Clean code always looks like it was written by someone who cares.",
  "Experience is the name everyone gives to their mistakes.",
  "Java is to JavaScript what car is to Carpet.",
  "It's not a bug; it's an undocumented feature.",
  "Code never lies, comments sometimes do.",
];

const EntryList = ({
  entries,
  onSelectEntry,
  onDeleteEntry,
  allTags = [],
  selectedTag,
  onTagSelect,
  searchTerm,
  onClearFilters
}) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const hasActiveFilters = searchTerm || selectedTag;

  return (
    <div className="entry-list">
      <header className="list-header">
        <div className="header-content">
          <h2>My Library</h2>
          <span className="entry-count">{entries.length} notes</span>
        </div>
        <div className="quote-container">
          <p>"{quote}"</p>
        </div>
      </header>

      {/* Tag Filter Bar */}
      {allTags.length > 0 && (
        <div className="tag-filter-bar">
          <div className="tag-filter-label">
            <Filter size={14} />
            <span>Filter by tag:</span>
          </div>
          <div className="tag-pills">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => onTagSelect(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filter Indicator */}
      {hasActiveFilters && (
        <div className="active-filters">
          <span className="filter-label">Showing results for:</span>
          {searchTerm && <span className="filter-badge">"{searchTerm}"</span>}
          {selectedTag && <span className="filter-badge tag">#{selectedTag}</span>}
          <button className="clear-filters" onClick={onClearFilters}>
            <X size={14} /> Clear all
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <div className="empty-state">
          {hasActiveFilters ? (
            <p>No notes match your filters. <button onClick={onClearFilters} className="link-btn">Clear filters</button></p>
          ) : (
            <p>No entries yet. Start learning!</p>
          )}
        </div>
      ) : (
        <div className="grid">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="entry-card"
              onClick={() => onSelectEntry(entry)}
            >
              <div className="card-content">
                <div className="card-top">
                  <h3 className="card-title">{entry.title}</h3>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEntry(entry.id);
                    }}
                    title="Delete Entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="card-excerpt">{entry.excerpt || entry.content?.slice(0, 100) + '...'}</p>

                <div className="card-footer">
                  <div className="meta-tags">
                    {entry.tags.map(tag => (
                      <span
                        key={tag}
                        className={`tag ${selectedTag === tag ? 'highlighted' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTagSelect && onTagSelect(tag);
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="date">
                    <Clock size={14} />
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .entry-list {
          max-width: 1000px;
          margin: 0 auto;
        }

        .list-header {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          border-bottom: 2px solid var(--color-bg-tertiary);
          padding-bottom: var(--spacing-lg);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .quote-container {
          background-color: var(--color-bg-secondary);
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-accent);
          display: flex;
          align-items: center;
          box-shadow: var(--shadow-sm);
        }

        .quote-container p {
          font-style: italic;
          color: var(--color-text-secondary);
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .tag-filter-bar {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm) 0;
        }

        .tag-filter-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-tertiary);
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .tag-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag-pill {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
          border: 1px solid var(--color-bg-tertiary);
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .tag-pill.active {
          background: var(--color-accent);
          color: white;
          border-color: var(--color-accent);
        }

        .active-filters {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(56, 178, 172, 0.1);
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-md);
        }

        .filter-label {
          color: var(--color-text-secondary);
          font-size: 0.85rem;
        }

        .filter-badge {
          background: var(--color-bg-secondary);
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.85rem;
          color: var(--color-text-primary);
        }

        .filter-badge.tag {
          background: var(--color-accent);
          color: white;
        }

        .clear-filters {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          transition: all 0.2s;
        }

        .clear-filters:hover {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        .entry-count {
          font-size: 0.9rem;
          color: var(--color-text-tertiary);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .entry-card {
          background-color: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-bg-tertiary);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .entry-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-accent);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-xs);
        }

        .card-title {
          font-size: 1.1rem;
          color: var(--color-text-primary);
          flex: 1;
        }

        .delete-btn {
          color: var(--color-text-tertiary);
          padding: 4px;
          border-radius: var(--radius-sm);
          opacity: 0;
          transition: all 0.2s;
        }

        .entry-card:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          color: var(--color-error);
          background-color: rgba(214, 104, 83, 0.1);
        }

        .card-excerpt {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-md);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--color-text-tertiary);
        }

        .meta-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag {
          color: var(--color-accent);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag:hover {
          opacity: 0.7;
        }

        .tag.highlighted {
          background: var(--color-accent);
          color: white;
          padding: 1px 6px;
          border-radius: 8px;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 0;
          color: var(--color-text-tertiary);
          font-style: italic;
        }

        .link-btn {
          color: var(--color-accent);
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default EntryList;
