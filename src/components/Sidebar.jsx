import React from 'react';
import { BookOpen, PlusCircle, Settings, Search, Leaf } from 'lucide-react';

const Sidebar = ({ activeItem, onNavigate, searchTerm, onSearchChange, searchInputRef }) => {
  const navItems = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'add', label: 'New Entry', icon: PlusCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Leaf size={24} color="var(--color-accent)" />
        </div>
        <h1 className="app-title">morinote</h1>
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
          background-color: var(--color-bg-primary);
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
          color: var(--color-text-primary);
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
          color: var(--color-text-tertiary);
        }

        .search-input {
          width: 100%;
          padding: 10px 30px 10px 36px;
          border: 1px solid var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-primary); 
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--color-text-primary);
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.1);
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
          color: var(--color-text-secondary);
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
          color: var(--color-text-secondary);
          transition: all 0.2s ease;
          text-align: left;
        }

        .nav-item:hover {
          background-color: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }

        .nav-item.active {
          background-color: rgba(56, 178, 172, 0.15);
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
          color: var(--color-text-tertiary);
          background: var(--color-bg-tertiary);
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0.7;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
