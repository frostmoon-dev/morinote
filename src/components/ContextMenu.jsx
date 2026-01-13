import React, { useEffect, useRef } from 'react';
import { Eye, Edit2, Trash2, Copy, Tag } from 'lucide-react';

const ContextMenu = ({
  isOpen,
  position,
  entry,
  onClose,
  onView,
  onEdit,
  onDelete,
  onCopyTitle,
  onCopyContent
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, onClose]);

  // Adjust position to stay within viewport
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust horizontal position
    if (rect.right > viewportWidth) {
      menu.style.left = `${position.x - rect.width}px`;
    }

    // Adjust vertical position
    if (rect.bottom > viewportHeight) {
      menu.style.top = `${position.y - rect.height}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: Eye, label: 'View', action: () => { onView(entry); onClose(); } },
    { icon: Edit2, label: 'Edit', action: () => { onEdit(entry); onClose(); } },
    { divider: true },
    { icon: Copy, label: 'Copy Title', action: () => { onCopyTitle(entry); onClose(); } },
    { icon: Copy, label: 'Copy Content', action: () => { onCopyContent(entry); onClose(); } },
    { divider: true },
    { icon: Trash2, label: 'Delete', action: () => { onDelete(entry); onClose(); }, danger: true }
  ];

  return (
    <>
      <div
        className="context-menu"
        ref={menuRef}
        style={{
          left: position.x,
          top: position.y
        }}
      >
        <div className="context-menu-header">
          <span className="entry-title">{entry?.title}</span>
          {entry?.tags?.length > 0 && (
            <div className="entry-tags">
              <Tag size={10} />
              {entry.tags.slice(0, 2).join(', ')}
              {entry.tags.length > 2 && '...'}
            </div>
          )}
        </div>
        <div className="context-menu-items">
          {menuItems.map((item, index) =>
            item.divider ? (
              <div key={index} className="context-menu-divider" />
            ) : (
              <button
                key={index}
                className={`context-menu-item ${item.danger ? 'danger' : ''}`}
                onClick={item.action}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      </div>

      <style>{`
        .context-menu {
          position: fixed;
          background: var(--color-bg-secondary);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--color-bg-tertiary);
          min-width: 180px;
          z-index: 1000;
          overflow: hidden;
          animation: contextMenuIn 0.15s ease;
        }

        @keyframes contextMenuIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .context-menu-header {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--color-bg-tertiary);
          border-bottom: 1px solid var(--color-bg-tertiary);
        }

        .entry-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-primary);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .entry-tags {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: var(--color-text-tertiary);
          margin-top: 2px;
        }

        .context-menu-items {
          padding: var(--spacing-xs) 0;
        }

        .context-menu-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: left;
          color: var(--color-text-primary);
          font-size: 0.9rem;
          transition: all var(--transition-fast);
          background: none;
          border: none;
          cursor: pointer;
        }

        .context-menu-item:hover {
          background: var(--color-bg-hover);
        }

        .context-menu-item.danger {
          color: var(--color-error);
        }

        .context-menu-item.danger:hover {
          background: var(--color-error-light);
        }

        .context-menu-divider {
          height: 1px;
          background: var(--color-bg-tertiary);
          margin: var(--spacing-xs) 0;
        }
      `}</style>
    </>
  );
};

export default ContextMenu;
