import React, { useState, useEffect } from 'react';
import { Clock, Tag, Trash2 } from 'lucide-react';

const QUOTES = [
  "Knowledge is power.",
  "First, solve the problem. Then, write the code.",
  "Simplicity is the soul of efficiency.",
  "Make it work, make it right, make it fast.",
  "Clean code always looks like it was written by someone who cares.",
  "Experience is the name everyone gives to their mistakes.",
  "Java is to JavaScript what car is to Carpet.",
  "It’s not a bug; it’s an undocumented feature.",
  "Code never lies, comments sometimes do.",
];

const EntryList = ({ entries, onSelectEntry, onDeleteEntry }) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

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

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>No entries yet. Start learning!</p>
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
                <p className="card-excerpt">{entry.excerpt}</p>

                <div className="card-footer">
                  <div className="meta-tags">
                    {entry.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
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

        /* Removed quote-icon style */

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
          /* FIX: Use theme status color to ensuring text is visible in dark mode.
             Or use a specific variable that flips correctly.
             Using var(--color-bg-secondary) ensures it's dark in dark mode, light in light mode. */
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
          color: var(--color-text-primary); /* Now visible because bg is appropriate */
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
      `}</style>
    </div>
  );
};

export default EntryList;
