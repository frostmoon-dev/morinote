import React, { useCallback } from 'react';
import { ArrowLeft, Printer, Calendar, Edit2 } from 'lucide-react';

const EntryDetail = ({ entry, onBack, onEdit, onUpdateContent }) => {
  if (!entry) return null;

  const handlePrint = () => {
    window.print();
  };

  // Handle checkbox toggling in view mode
  const handleCheckboxClick = useCallback((e) => {
    if (!onUpdateContent || e.target.tagName !== 'INPUT' || e.target.type !== 'checkbox') return;

    // Get the list item and toggle its data-checked attribute
    const listItem = e.target.closest('li');
    if (!listItem) return;

    const isChecked = e.target.checked;

    // Parse and update the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(entry.content, 'text/html');

    // Find and update the corresponding checkbox
    const checkboxes = doc.querySelectorAll('input[type="checkbox"]');
    const viewCheckboxes = document.querySelectorAll('.markdown-body input[type="checkbox"]');

    viewCheckboxes.forEach((cb, index) => {
      if (cb === e.target && checkboxes[index]) {
        checkboxes[index].checked = isChecked;
        checkboxes[index].setAttribute('checked', isChecked ? 'checked' : '');
        if (!isChecked) checkboxes[index].removeAttribute('checked');

        // Update the parent li's data-checked attribute
        const parentLi = checkboxes[index].closest('li');
        if (parentLi) {
          parentLi.setAttribute('data-checked', isChecked ? 'true' : 'false');
        }
      }
    });

    const newContent = doc.body.innerHTML;
    onUpdateContent(entry.id, newContent);
  }, [entry, onUpdateContent]);

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

        {/* Render HTML content directly */}
        <div
          className="markdown-body"
          onClick={handleCheckboxClick}
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      </div>

      <style>{`
        .entry-detail {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          color: #1a1a1a;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          min-height: 80vh;
          position: relative;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid #eee;
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
          color: #4a4a4a;
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
          color: #000;
        }

        .meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
          color: #555;
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
          background-color: #f0f0f0;
          color: #4a4a4a;
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid #e0e0e0;
        }

        /* HTML Content Styles */
        .markdown-body {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #1a1a1a;
        }
        
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #000;
          font-weight: 700;
        }

        .markdown-body h1 { font-size: 1.8em; }
        .markdown-body h2 { font-size: 1.5em; }
        .markdown-body h3 { font-size: 1.2em; }

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

        /* Task List Styles */
        .markdown-body ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .markdown-body ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding-left: 0;
        }

        .markdown-body ul[data-type="taskList"] li > label {
          display: flex;
          align-items: center;
          margin-top: 2px;
        }

        .markdown-body ul[data-type="taskList"] input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--color-accent);
        }

        .markdown-body ul[data-type="taskList"] li[data-checked="true"] > div {
          text-decoration: line-through;
          color: #888;
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
          background-color: #f4f4f4;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 0.9em;
          color: #e83e8c;
        }

        .markdown-body pre {
          background-color: #2d2d2d;
          color: #f8f8f2;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }

        .markdown-body pre code {
          background-color: transparent;
          color: #f8f8f2;
          padding: 0;
        }

        .markdown-body img {
          max-width: 100%;
          border-radius: 8px;
          margin: 1em 0;
        }

        .markdown-body blockquote {
          border-left: 4px solid var(--color-accent);
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
          font-style: italic;
        }

        .markdown-body hr {
          border: none;
          border-top: 2px solid #eee;
          margin: 2em 0;
        }

        /* Print Styles */
        @media print {
          .detail-header, .sidebar {
            display: none !important;
          }
          
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

          .entry-detail {
            visibility: visible !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
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
