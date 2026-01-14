import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Save, X, Image, Link, Upload, Bold, Italic, Strikethrough, List, ListOrdered, CheckSquare, Code, Quote, Heading1, Heading2, Minus, Crop } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const EntryForm = ({ onSave, onCancel, initialData, onDirtyChange }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  // Cropping state
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your learning journey here...',
      }),
    ],
    content: initialData?.content || '',
    onUpdate: ({ editor }) => {
      if (onDirtyChange) {
        const currentContent = editor.getHTML();
        const initialContent = initialData?.content || '';
        const isDirty = title !== (initialData?.title || '') ||
          currentContent !== initialContent ||
          tags !== (initialData?.tags?.join(', ') || '');
        onDirtyChange(isDirty);
      }
    },
  });

  // Track dirty state for title and tags
  useEffect(() => {
    if (!onDirtyChange || !editor) return;

    const initialTitle = initialData?.title || '';
    const initialContent = initialData?.content || '';
    const initialTags = initialData?.tags?.join(', ') || '';

    const currentContent = editor.getHTML();
    const isDirty = title !== initialTitle || currentContent !== initialContent || tags !== initialTags;
    onDirtyChange(isDirty);

    return () => onDirtyChange(false);
  }, [title, tags, initialData, onDirtyChange, editor]);

  // Insert image into editor
  const insertImage = useCallback((url, alt = 'image') => {
    if (!url || !editor) return;

    editor.chain().focus().setImage({ src: url, alt }).run();

    setShowImageModal(false);
    setShowCropModal(false);
    setImageUrl('');
    setImageAlt('');
    setImageToCrop(null);
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    setCompletedCrop(null);
  }, [editor]);

  // Handle local file upload - now goes to crop modal first
  const handleFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image is too large. Please use an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setImageToCrop(base64);
        setShowImageModal(false);
        setShowCropModal(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  }, []);

  // Handle URL image - load and go to crop modal
  const handleUrlImage = useCallback(() => {
    if (!imageUrl) return;

    // For URLs, we need to load the image and convert to base64 for cropping
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const dataUrl = canvas.toDataURL('image/png');
        setImageToCrop(dataUrl);
        setShowImageModal(false);
        setShowCropModal(true);
      } catch (e) {
        // CORS issue - insert directly without cropping
        insertImage(imageUrl, imageAlt || 'image');
      }
    };
    img.onerror = () => {
      // If loading fails, try inserting directly
      insertImage(imageUrl, imageAlt || 'image');
    };
    img.src = imageUrl;
  }, [imageUrl, imageAlt, insertImage]);

  // Skip crop and insert directly
  const handleSkipCrop = useCallback(() => {
    if (imageToCrop) {
      insertImage(imageToCrop, imageAlt || 'image');
    }
  }, [imageToCrop, imageAlt, insertImage]);

  // Generate cropped image and insert
  const handleCropComplete = useCallback(() => {
    if (!completedCrop || !imageRef.current || !canvasRef.current) {
      // If no crop selected, use original
      if (imageToCrop) {
        insertImage(imageToCrop, imageAlt || 'image');
      }
      return;
    }

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          insertImage(reader.result, imageAlt || 'cropped-image');
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/png', 1);
  }, [completedCrop, imageToCrop, imageAlt, insertImage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editor) return;

    onSave({
      id: initialData?.id,
      title,
      content: editor.getHTML(),
      tags: tags.split(/[,\s]+/).map(t => t.trim().toLowerCase()).filter(Boolean),
      createdAt: initialData?.createdAt || new Date().toISOString()
    });
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <header className="form-header">
        <h2>{initialData ? 'Edit Note' : 'New Learning Entry'}</h2>
        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <X size={18} /> Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!title || !editor.getText().trim()}>
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

        {/* Custom Toolbar */}
        <div className="editor-toolbar">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'active' : ''}
            title="Strikethrough"
          >
            <Strikethrough size={18} />
          </button>

          <span className="toolbar-divider" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>

          <span className="toolbar-divider" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="Numbered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'active' : ''}
            title="Task List"
          >
            <CheckSquare size={18} />
          </button>

          <span className="toolbar-divider" />

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'active' : ''}
            title="Quote"
          >
            <Quote size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'active' : ''}
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            <Minus size={18} />
          </button>

          <span className="toolbar-divider" />

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            title="Insert Image"
          >
            <Image size={18} />
          </button>
        </div>

        {/* TipTap Editor */}
        <EditorContent editor={editor} className="tiptap-editor" />
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
                  Choose File (will open cropper)
                </label>
                <span className="help-text">Max 5MB. You can crop after selecting.</span>
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
                onClick={handleUrlImage}
                disabled={!imageUrl}
              >
                <Crop size={16} /> Load & Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Crop Modal */}
      {showCropModal && imageToCrop && (
        <div className="image-modal-overlay" onClick={() => setShowCropModal(false)}>
          <div className="crop-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Crop size={20} /> Crop Image</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setShowCropModal(false);
                  setImageToCrop(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="crop-container">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imageRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  style={{ maxWidth: '100%', maxHeight: '60vh' }}
                />
              </ReactCrop>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="crop-help">
              <p>Drag to select the area you want to crop. Leave empty to use full image.</p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowCropModal(false);
                  setImageToCrop(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleSkipCrop}
              >
                Skip Crop
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCropComplete}
              >
                <Crop size={16} /> Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .entry-form {
          max-width: 900px;
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

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .form-group.full-height {
          flex: 1;
          min-height: 0;
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
          color: #333;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.1);
        }
        
        .help-text {
          font-size: 0.8rem;
          color: var(--color-text-tertiary);
          margin-top: 4px;
        }

        /* Editor Toolbar */
        .editor-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 8px 12px;
          background: #f5f5f5;
          border: 1px solid var(--color-bg-tertiary);
          border-bottom: none;
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        }

        .editor-toolbar button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          color: #555;
          transition: all 0.15s;
        }

        .editor-toolbar button:hover {
          background: #e0e0e0;
          color: #000;
        }

        .editor-toolbar button.active {
          background: var(--color-accent);
          color: white;
        }

        .toolbar-divider {
          width: 1px;
          height: 24px;
          background: #ddd;
          margin: 4px 6px;
        }

        /* TipTap Editor Styles */
        .tiptap-editor {
          flex: 1;
          min-height: 300px;
          border: 1px solid var(--color-bg-tertiary);
          border-radius: 0 0 var(--radius-sm) var(--radius-sm);
          background: white;
          overflow-y: auto;
        }

        .tiptap-editor .tiptap {
          padding: 20px;
          min-height: 300px;
          outline: none;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          line-height: 1.7;
          color: #1a1a1a;
        }

        .tiptap-editor .tiptap p {
          margin: 0 0 1em 0;
        }

        .tiptap-editor .tiptap h1,
        .tiptap-editor .tiptap h2,
        .tiptap-editor .tiptap h3 {
          margin: 1.5em 0 0.5em 0;
          font-weight: 700;
          color: #111;
        }

        .tiptap-editor .tiptap h1 { font-size: 1.8em; }
        .tiptap-editor .tiptap h2 { font-size: 1.5em; }
        .tiptap-editor .tiptap h3 { font-size: 1.2em; }

        .tiptap-editor .tiptap ul,
        .tiptap-editor .tiptap ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .tiptap-editor .tiptap li {
          margin: 0.25em 0;
        }

        /* Task List Styles */
        .tiptap-editor .tiptap ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }

        .tiptap-editor .tiptap ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .tiptap-editor .tiptap ul[data-type="taskList"] li > label {
          display: flex;
          align-items: center;
          margin-top: 2px;
        }

        .tiptap-editor .tiptap ul[data-type="taskList"] li > label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--color-accent);
        }

        .tiptap-editor .tiptap ul[data-type="taskList"] li > div {
          flex: 1;
        }

        .tiptap-editor .tiptap ul[data-type="taskList"] li[data-checked="true"] > div {
          text-decoration: line-through;
          color: #888;
        }

        /* Blockquote */
        .tiptap-editor .tiptap blockquote {
          border-left: 4px solid var(--color-accent);
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
          font-style: italic;
        }

        /* Code Block */
        .tiptap-editor .tiptap pre {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 0.9em;
        }

        .tiptap-editor .tiptap code {
          background: #f4f4f4;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Consolas', 'Monaco', monospace;
          font-size: 0.9em;
          color: #e83e8c;
        }

        .tiptap-editor .tiptap pre code {
          background: none;
          color: inherit;
          padding: 0;
        }

        /* Horizontal Rule */
        .tiptap-editor .tiptap hr {
          border: none;
          border-top: 2px solid #eee;
          margin: 2em 0;
        }

        /* Images */
        .tiptap-editor .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
          display: block;
        }

        /* Link Styles */
        .tiptap-editor .tiptap a {
          color: var(--color-accent);
          text-decoration: underline;
          cursor: pointer;
        }

        /* Placeholder */
        .tiptap-editor .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af;
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* Modal Styles */
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

        .crop-modal {
          background: white;
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          display: flex;
          flex-direction: column;
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

        .crop-container {
          padding: var(--spacing-lg);
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f0f0f0;
          overflow: auto;
          max-height: 60vh;
        }

        .crop-help {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: #fff9e6;
          border-top: 1px solid #ffe082;
        }

        .crop-help p {
          margin: 0;
          font-size: 0.85rem;
          color: #856404;
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
