import React from 'react';
import { BookOpen, PlusCircle, Settings, Search } from 'lucide-react';

const Sidebar = ({ activeItem, onNavigate, searchTerm, onSearchChange, searchInputRef, isOpen, onClose }) => {
  const navItems = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'add', label: 'New Entry', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">
            <img src="/cake.png" alt="Morinote" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          </div>
          <h1 className="app-title">morinote</h1>
          <button className="mobile-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes... (press /)"
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <nav className="nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
                {item.id === 'add' && <span className="shortcut-hint">Ctrl+N</span>}
              </button>
            );
          })}
        </nav>

        <style>{`
        .sidebar {
          width: 260px;
          background-color: var(--color-sidebar-bg);
          border-right: 1px solid var(--color-bg-tertiary);
          display: flex;
          flex-direction: column;
          padding: var(--spacing-lg);
          flex-shrink: 0;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
          padding-left: var(--spacing-xs);
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: var(--color-bg-secondary);
          border-radius: 50%;
        }

        .app-title {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--color-sidebar-text);
          letter-spacing: -0.02em;
          margin: 0;
        }

        .search-container {
          position: relative;
          margin-bottom: var(--spacing-lg);
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-sidebar-text-secondary);
        }

        .search-input {
          width: 100%;
          padding: 10px 30px 10px 36px;
          border: 1px solid var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-secondary); 
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--color-sidebar-text);
          transition: all 0.2s ease;
        }

        .search-input::placeholder {
          color: var(--color-sidebar-text-secondary);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-accent);
          background-color: var(--color-bg-secondary);
          box-shadow: 0 0 0 3px var(--color-accent-light);
        }

        .clear-search {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-bg-tertiary);
          color: var(--color-sidebar-text);
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-search:hover {
          background: var(--color-accent);
          color: white;
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: 10px 12px;
          border-radius: var(--radius-md);
          color: var(--color-sidebar-text-secondary);
          transition: all 0.2s ease;
          text-align: left;
        }

        .nav-item:hover {
          background-color: var(--color-accent-light);
          color: var(--color-sidebar-text);
        }

        .nav-item.active {
          background-color: var(--color-accent-light);
          color: var(--color-accent);
          font-weight: 500;
        }

        .nav-icon {
          opacity: 0.8;
        }

        .nav-item.active .nav-icon {
          opacity: 1;
        }

        .shortcut-hint {
          margin-left: auto;
          font-size: 0.7rem;
          color: var(--color-sidebar-text-secondary);
          background: var(--color-bg-tertiary);
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0.7;
        }
          .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mobile-close-btn {
          display: none;
          margin-left: auto;
          background: none;
          border: none;
          font-size: 24px;
          color: var(--color-text-secondary);
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: 80%; /* Wider on specific mobile but max-width handled */
            max-width: 300px;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
          }
          
          .sidebar.open {
            transform: translateX(0);
          }
          
          .mobile-overlay {
            display: block;
            pointer-events: none;
          }
          
          .mobile-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }

          .mobile-close-btn {
            display: block;
          }
        }
      `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
