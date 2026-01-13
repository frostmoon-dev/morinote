import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger' // 'danger' | 'warning' | 'info'
}) => {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button when dialog opens (safer default)
      confirmButtonRef.current?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const variantColors = {
    danger: {
      icon: 'var(--color-error)',
      iconBg: 'var(--color-error-light)',
      button: 'var(--color-error)',
      buttonHover: '#d35f5f'
    },
    warning: {
      icon: 'var(--color-warning)',
      iconBg: 'var(--color-warning-light)',
      button: 'var(--color-warning)',
      buttonHover: '#d4902f'
    },
    info: {
      icon: 'var(--color-accent)',
      iconBg: 'var(--color-accent-light)',
      button: 'var(--color-accent)',
      buttonHover: 'var(--color-accent-hover)'
    }
  };

  const colors = variantColors[variant];

  return (
    <div className="dialog-overlay" onClick={handleBackdropClick}>
      <div className="dialog-container" ref={dialogRef} role="dialog" aria-modal="true">
        <button className="dialog-close" onClick={onCancel} aria-label="Close">
          <X size={18} />
        </button>

        <div className="dialog-icon" style={{ backgroundColor: colors.iconBg }}>
          <AlertTriangle size={24} style={{ color: colors.icon }} />
        </div>

        <h2 className="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>

        <div className="dialog-actions">
          <button className="dialog-btn cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className="dialog-btn confirm"
            onClick={onConfirm}
            ref={confirmButtonRef}
            style={{
              '--btn-color': colors.button,
              '--btn-hover': colors.buttonHover
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .dialog-container {
          background: var(--color-bg-secondary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          min-width: 320px;
          max-width: 400px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-bg-tertiary);
          position: relative;
          animation: slideIn 0.2s ease;
          text-align: center;
        }

        .dialog-close {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          color: var(--color-text-tertiary);
          transition: all var(--transition-fast);
        }

        .dialog-close:hover {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        .dialog-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--spacing-md);
        }

        .dialog-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .dialog-message {
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: var(--spacing-xl);
        }

        .dialog-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }

        .dialog-btn {
          padding: var(--spacing-sm) var(--spacing-xl);
          border-radius: var(--radius-sm);
          font-weight: 500;
          font-size: 0.95rem;
          transition: all var(--transition-fast);
          min-width: 100px;
        }

        .dialog-btn.cancel {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        .dialog-btn.cancel:hover {
          background: var(--color-bg-hover);
        }

        .dialog-btn.confirm {
          background: var(--btn-color);
          color: white;
        }

        .dialog-btn.confirm:hover {
          background: var(--btn-hover);
        }

        .dialog-btn:focus {
          outline: 2px solid var(--color-accent);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDialog;
