import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Save, X, Image, Link, Upload } from 'lucide-react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const EntryForm = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const editorRef = useRef(null);

  // Custom image handler
  const insertImage = useCallback((url, alt = 'image') => {
    if (!url) return;

    // For base64 images, store in localStorage and use a reference
    if (url.startsWith('data:')) {
      const imageId = `img_${Date.now()}`;
      try {
        localStorage.setItem(imageId, url);
        // Insert a cleaner placeholder that includes the imageId
        const markdown = `![${alt}](local:${imageId})`;
        setContent(prev => prev + '\n' + markdown + '\n');
      } catch (e) {
        // If localStorage is full, fall back to inline but truncated display
        alert('Image storage is full. Please use a URL instead or clear some old entries.');
        return;
      }
    } else {
      // For URLs, insert normally
      const markdown = `![${alt}](${url})`;
      setContent(prev => prev + '\n' + markdown + '\n');
    }

    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  }, []);

  // Handle local file upload
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for localStorage)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image is too large. Please use an image under 2MB for local upload.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        insertImage(base64, imageAlt || file.name.split('.')[0]);
      }
    };
    reader.readAsDataURL(file);
  }, [insertImage, imageAlt]);

  // Custom toolbar with image handler
  const editorOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      placeholder: "Write your learning journey here...",
      status: false,
      toolbar: [
        "bold", "italic", "heading", "|",
        "quote", "unordered-list", "ordered-list", "|",
        "link",
        {
          name: "image",
          action: () => setShowImageModal(true),
          className: "fa fa-picture-o",
          title: "Insert Image",
        },
        "code", "|",
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

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Image size={20} /> Insert Image</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowImageModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="image-option">
                <label><Link size={16} /> From URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div className="image-option">
                <label>Alt Text (optional)</label>
                <input
                  type="text"
                  placeholder="Description of the image"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>

              <div className="modal-divider">
                <span>or</span>
              </div>

              <div className="image-option upload-option">
                <label><Upload size={16} /> Upload Local Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-btn">
                  Choose File
                </label>
                <span className="help-text">Max 5MB. Will be embedded as base64.</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowImageModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => insertImage(imageUrl, imageAlt || 'image')}
                disabled={!imageUrl}
              >
                Insert from URL
              </button>
            </div>
          </div>
        </div>
      )}

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
          font-family: var(--font-sans); /* CHANGED: Use Quicksand for a richer feel */
          font-size: 1.05rem; /* CHANGED: Slightly larger for readability */
          line-height: 1.7; /* CHANGED: More breathing room */
          color: #1a1a1a !important; /* FORCE DARK TEXT */
          background-color: white !important; /* ENSURE WHITE BG */
          min-height: 400px;
          padding: 20px !important; /* CHANGED: More padding text */
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

        /* Hybrid Markdown Styling - HIGH VISIBILITY */
        .editor-wrapper .CodeMirror .cm-formatting {
           color: #333 !important; /* CHANGED: Much darker, almost black */
           font-size: 1em; 
           font-weight: 500 !important;
           opacity: 1 !important;
        }

        /* Header formatting chars (###) */
        .editor-wrapper .CodeMirror .cm-formatting-header {
           color: var(--color-accent) !important;
           opacity: 1 !important; /* CHANGED: No transparency */
           font-weight: bold !important;
        }

        /* START: Bullet Point Styling (Turn * into •) */
        .editor-wrapper .CodeMirror .cm-formatting-list-ul {
           position: relative;
           color: transparent !important; /* Hide the actual asterisk */
           min-width: 15px; /* Ensure space for bullet */
           display: inline-block;
        }

        .editor-wrapper .CodeMirror .cm-formatting-list-ul::after {
           content: '•';
           position: absolute;
           left: 0;
           top: -5px; /* Fine-tune vertical alignment */
           color: #000; /* Bold Black Bullet */
           font-size: 2em; /* Large bullet */
           font-weight: bold;
           visibility: visible;
           line-height: 1;
        }
        /* END: Bullet Point Styling */

        /* Ordered List Numbers (1., 2.) - Keep text, make bold black */
        .editor-wrapper .CodeMirror .cm-formatting-list-ol {
           color: #000 !important;
           font-weight: 800 !important;
        }

        /* WYSIWYG: Hide asterisks for bold (**text**) */
        .editor-wrapper .CodeMirror .cm-formatting-strong {
           font-size: 0 !important;
           color: transparent !important;
           width: 0 !important;
           margin: 0 !important;
           padding: 0 !important;
        }

        /* WYSIWYG: Hide asterisks for italic (*text*) */
        .editor-wrapper .CodeMirror .cm-formatting-em {
           font-size: 0 !important;
           color: transparent !important;
           width: 0 !important;
           margin: 0 !important;
           padding: 0 !important;
        }

        .editor-wrapper .cm-header {
          color: #111 !important;
          font-weight: 700 !important;
          font-size: 1.5em; 
        }

        .editor-wrapper .cm-strong {
          color: #000 !important;
          font-weight: 800 !important;
        }

        .editor-wrapper .cm-em {
          color: #222 !important;
          font-style: italic !important;
        }

        .editor-wrapper .cm-link {
          color: #d06d75 !important;
          text-decoration: underline !important;
        }

        /* WYSIWYG: Hide long URLs (especially base64 images) */
        .editor-wrapper .cm-url {
          font-size: 0 !important;
          color: transparent !important;
        }

        /* WYSIWYG: Hide image markdown formatting */
        .editor-wrapper .cm-formatting-image {
          font-size: 0 !important;
          color: transparent !important;
        }

        /* Show image indicator instead of raw markdown */
        .editor-wrapper .cm-image {
          color: var(--color-accent) !important;
          font-weight: 500 !important;
        }

        /* Style for image alt text - make it visible as a placeholder */
        .editor-wrapper .cm-image-alt-text {
          color: #666 !important;
          font-style: italic !important;
          background: rgba(229, 152, 155, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Hide the entire image line and show indicator */
        .editor-wrapper .CodeMirror-line:has(.cm-image) {
          position: relative;
        }
        
        .editor-wrapper .cm-quote {
          color: #666 !important;
          font-style: italic !important;
          border-left: 4px solid #ddd;
          padding-left: 10px;
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
        
        /* Fix placeholder color */
        .CodeMirror-placeholder {
          color: #9ca3af !important; /* Clearly visible placeholder */
        }

        /* Image Modal Styles */
        .image-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .image-modal {
          background: white;
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 480px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid #eee;
          background: #f9f9f9;
        }

        .modal-header h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.1rem;
          color: #333;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #eee;
          color: #333;
        }

        .modal-body {
          padding: var(--spacing-lg);
        }

        .image-option {
          margin-bottom: var(--spacing-md);
        }

        .image-option label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .image-option input[type="text"] {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          background: white;
          color: #333;
        }

        .image-option input[type="text"]:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.1);
        }

        .image-option input[type="file"] {
          display: none;
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #4a5568;
          border: 2px solid #4a5568;
          border-radius: var(--radius-sm);
          color: #ffffff !important;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .upload-btn:hover {
          background: #2d3748;
          border-color: #2d3748;
          color: #ffffff !important;
        }

        .upload-option .help-text {
          display: block;
          margin-top: 8px;
          font-size: 0.8rem;
          color: #888;
        }

        .modal-divider {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          margin: var(--spacing-lg) 0;
          color: #aaa;
        }

        .modal-divider::before,
        .modal-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #eee;
        }

        .modal-divider span {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          border-top: 1px solid #eee;
          background: #f9f9f9;
        }
      `}</style>
    </form>
  );
};

export default EntryForm;
