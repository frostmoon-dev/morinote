import React, { useState, useMemo } from 'react';
import { Save, X } from 'lucide-react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const EntryForm = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');

  // Memoize options to prevent re-rendering issues
  const editorOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      placeholder: "Write your learning journey here...",
      status: false, // Hide status bar for cleaner UI
      toolbar: [
        "bold", "italic", "heading", "|",
        "quote", "unordered-list", "ordered-list", "|",
        "link", "image", "code", "|",
        "preview", "side-by-side", "fullscreen"
      ],
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: initialData?.id, // Preserve ID if editing
      title,
      content,
      tags: tags.split(/[,\s]+/).map(t => t.trim()).filter(Boolean),
      createdAt: initialData?.createdAt || new Date().toISOString()
    });
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <header className="form-header">
        <h2>{initialData ? 'Edit Note' : 'New Learning Entry'}</h2>
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <X size={18} /> Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!title || !content}>
            <Save size={18} /> Save Note
          </button>
        </div>
      </header>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="What did you learn today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus={!initialData}
        />
        <span className="help-text">Be specific! e.g., "React Hooks useEffect"</span>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          placeholder="react hooks javascript (separate with spaces or commas)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="form-group full-height editor-wrapper">
        <label>Content</label>
        <SimpleMDE
          value={content}
          onChange={setContent}
          options={editorOptions}
        />
      </div>

      <style>{`
        /* Removed inline styles for EntryForm here as they are now in the component, 
           ensuring we don't have duplicates or conflicts. 
           We will trust the styled-jsx block in EntryForm.jsx */
        
        .entry-form {
          max-width: 900px; /* Slightly wider for editor */
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: var(--spacing-lg);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        /* Button Styles */
        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: var(--color-accent);
          color: white;
        }
        .btn-primary:hover:not(:disabled) {
          background-color: var(--color-accent-hover);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: transparent;
          color: var(--color-text-secondary);
          border: 1px solid var(--color-bg-tertiary);
        }
        .btn-secondary:hover {
          background-color: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }

        /* Inputs */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .form-group.full-height {
          flex: 1;
        }

        label {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        input {
          padding: 12px;
          border: 1px solid var(--color-bg-tertiary);
          border-radius: var(--radius-sm);
          font-family: var(--font-sans);
          font-size: 1rem;
          background-color: white;
          color: #333; /* Force dark text on white input */
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.1);
        }
        
        /* Help Text */
        .help-text {
          font-size: 0.8rem;
          color: var(--color-text-tertiary);
          margin-top: 4px;
        }

        /* SimpleMDE Overrides */
        .editor-wrapper .EasyMDEContainer .editor-toolbar {
          border-color: var(--color-bg-tertiary);
          background-color: #f5f5f5;
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          opacity: 1;
        }
        
        .editor-wrapper .EasyMDEContainer .CodeMirror {
          border-color: var(--color-bg-tertiary);
          border-radius: 0 0 var(--radius-sm) var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 1rem;
          color: #1a1a1a !important; /* FORCE DARK TEXT */
          background-color: white !important; /* ENSURE WHITE BG */
          min-height: 400px;
        }

        /* Fix cursor color */
        .editor-wrapper .CodeMirror-cursor {
          border-left: 2px solid #333 !important;
        }

        /* Toolbar Button Styling */
        .editor-wrapper .editor-toolbar button {
          color: #333 !important; /* Dark icons */
        }

        .editor-wrapper .editor-toolbar button:hover,
        .editor-wrapper .editor-toolbar button.active {
          background-color: #e0e0e0 !important; /* Light grey hover */
          border-color: #d0d0d0 !important;
          color: #000 !important;
        }

        /* Hybrid Markdown Styling - Aggressively dim syntax */
        .editor-wrapper .CodeMirror .cm-formatting {
          color: transparent !important; /* Try to hide them visually */
          font-size: 0px; /* Shrink them */
          letter-spacing: -5px; /* Collapse space */
        }
        
        /* But keep them visible when selecting or if cursor is nearby? 
           CodeMirror doesn't easily support "show on hover" for individual chars without plugins.
           Let's go for "Very Subtle" instead of "Invisible" to avoid editing confusion.
        */
        .editor-wrapper .CodeMirror .cm-formatting {
           color: #ddd !important; /* Very faint grey */
           font-size: 0.8em;
           font-weight: normal !important;
        }

        /* Specific overrides for headers to be cleaner */
        .editor-wrapper .CodeMirror .cm-formatting-header {
           opacity: 0.2;
        }

        .editor-wrapper .CodeMirror .cm-formatting-strong,
        .editor-wrapper .CodeMirror .cm-formatting-em {
           opacity: 0.2;
        }

        .editor-wrapper .cm-header {
          color: #000 !important;
          font-weight: 700 !important;
          font-size: 1.5em; /* Make headers bigger in editor too */
        }

        .editor-wrapper .cm-strong {
          color: #000 !important;
          font-weight: 800 !important;
        }


        .editor-wrapper .cm-em {
          color: #333 !important;
          font-style: italic !important;
        }

        .editor-wrapper .cm-link {
          color: #d06d75 !important;
          text-decoration: underline !important;
        }

        .editor-wrapper .cm-url {
          color: #aaa !important;
        }
        
        .editor-wrapper .cm-quote {
          color: #777 !important;
          font-style: italic !important;
        }

        /* Preview Mode Styling - Match Detail View */
        .editor-wrapper .editor-preview {
          background-color: white !important;
          color: #1a1a1a !important;
          font-family: var(--font-sans) !important;
          line-height: 1.8 !important;
          padding: 20px !important;
        }

        .editor-wrapper .editor-preview h1, 
        .editor-wrapper .editor-preview h2 {
          color: #000 !important;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.3em;
        }
        
        .editor-wrapper .editor-preview a {
          color: #d06d75 !important;
        }
        
        /* Fix placeholder color if possible (CodeMirror specific) */
        .CodeMirror-placeholder {
          color: #888 !important;
        }
      `}</style>
    </form>
  );
};

export default EntryForm;
