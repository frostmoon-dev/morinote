import React, { useMemo, useCallback } from 'react';
import { ArrowLeft, Printer, Calendar, Edit2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const EntryDetail = ({ entry, onBack, onEdit }) => {
  if (!entry) return null;

  const handlePrint = () => {
    window.print(); // Simple PDF export via browser/electron print dialog
  };

  // Custom image component that handles local: references
  const ImageRenderer = useCallback(({ src, alt }) => {
    let imageSrc = src;

    // Handle local: references - extract imageId and get from localStorage
    if (src && src.startsWith('local:')) {
      const imageId = src.replace('local:', '');
      const storedImage = localStorage.getItem(imageId);
      if (storedImage) {
        imageSrc = storedImage;
      } else {
        // Image not found, show placeholder
        return (
          <div style={{
            padding: '20px',
            background: '#f5f5f5',
            border: '1px dashed #ccc',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#888'
          }}>
            📷 Image not found: {alt || imageId}
          </div>
        );
      }
    }

    return (
      <img
        src={imageSrc}
        alt={alt || 'Image'}
        style={{
          maxWidth: '100%',
          borderRadius: '8px',
          margin: '1em 0'
        }}
      />
    );
  }, []);

  return (
    <article className="entry-detail">
      <header className="detail-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="actions">
          <button onClick={() => onEdit(entry)} className="action-btn" title="Edit Entry">
            <Edit2 size={20} /> Edit
          </button>
          <button onClick={handlePrint} className="action-btn" title="Export Proof">
            <Printer size={20} /> Proof
          </button>
        </div>
      </header>

      <div className="content-wrapper">
        <h1 className="title">{entry.title}</h1>

        <div className="meta">
          <span className="date">
            <Calendar size={16} />
            {new Date(entry.createdAt).toLocaleDateString()}
          </span>
          <div className="tags">
            {entry.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="markdown-body">
          <ReactMarkdown
            components={{
              img: ImageRenderer
            }}
          >
            {entry.content}
          </ReactMarkdown>
        </div>
      </div>

      <style>{`
        .entry-detail {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          color: #1a1a1a; /* Even darker for primary text */
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          min-height: 80vh; /* Paper-like feel */
          position: relative;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid #eee; /* Light gray border instead of variable */
        }

        .actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .back-btn, .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          color: #4a4a4a; /* Darker grey */
          transition: color 0.2s;
        }

        .back-btn:hover, .action-btn:hover {
          color: var(--color-accent);
        }

        .content-wrapper {
          padding: var(--spacing-xl);
        }

        .title {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-md);
          color: #000; /* Pure black for titles */
        }

        .meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
          color: #555; /* Darker grey for meta */
          font-size: 0.9rem;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tags {
          display: flex;
          gap: 8px;
        }

        .tag {
          background-color: #f0f0f0; /* Fixed light grey for white paper */
          color: #4a4a4a; /* Fixed dark grey text */
          padding: 2px 10px;
          border-radius: 12px; /* Soft pill shape */
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid #e0e0e0;
        }

        /* Markdown Styles */
        .markdown-body {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #1a1a1a;
        }
        
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #000;
        }

        .markdown-body p {
          margin-bottom: 1em;
        }

        .markdown-body ul,
        .markdown-body ol {
          padding-left: 2em;
          margin-bottom: 1em;
        }

        .markdown-body li {
          margin-bottom: 0.5em;
          padding-left: 0.5em;
        }

        .markdown-body a {
          color: var(--color-accent); 
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }
        
        .markdown-body a:hover {
          color: var(--color-accent-hover);
        }
        
        .markdown-body code {
          background-color: var(--color-bg-primary); /* Soft mint/grey */
          padding: 2px 6px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.9em;
          color: var(--color-accent); /* Use theme accent */
        }

        .markdown-body pre {
          background-color: #f9f9f9;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
          border: 1px solid #eee;
        }

        .markdown-body pre code {
          background-color: transparent;
          color: #333;
          padding: 0;
        }

        .markdown-body img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1em 0;
        }
        /* Print Styles - crucial for "Proof" */
        @media print {
          .detail-header, .sidebar {
            display: none !important; /* Hide UI */
          }
          
          /* Reset layout containers so they don't hide content */
          body, #root, .layout, .main-content {
            visibility: visible !important;
            display: block !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            position: static !important;
          }

          /* Force the detail view to take over */
          .entry-detail {
            visibility: visible !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important; /* Add some print padding */
            box-shadow: none !important;
            border: none !important;
            min-height: auto !important;
          }

          .content-wrapper {
            padding: 0 !important;
          }
        }
      `}</style>
    </article>
  );
};

export default EntryDetail;
