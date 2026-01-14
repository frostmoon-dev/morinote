import React, { useEffect, useState } from 'react';
import { Check, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const icons = {
        success: <Check size={18} />,
        info: <Info size={18} />,
        warning: <AlertTriangle size={18} />,
        error: <XCircle size={18} />
    };

    const colors = {
        success: 'var(--color-success)',
        info: 'var(--color-info)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)'
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">{icons[type]}</div>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={onClose}><X size={14} /></button>

            <style>{`
        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          background: white;
          box-shadow: var(--shadow-lg);
          z-index: 2000;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 300px;
          border-left: 4px solid ${colors[type]};
        }

        .toast-info { border-left-color: var(--color-info); }
        .toast-success { border-left-color: var(--color-success); }
        .toast-warning { border-left-color: var(--color-warning); }
        .toast-error { border-left-color: var(--color-error); }

        .toast-icon {
          color: ${colors[type]};
          display: flex;
          align-items: center;
        }

        .toast-message {
          flex: 1;
          font-size: 0.95rem;
          color: var(--color-text-primary);
        }

        .toast-close {
          background: none;
          border: none;
          color: var(--color-text-tertiary);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .toast-close:hover {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default Toast;
