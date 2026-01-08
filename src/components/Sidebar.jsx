import React, { useState } from 'react';
import { BookOpen, PlusCircle, Settings, Search, Leaf } from 'lucide-react';

const Sidebar = ({ activeItem, onNavigate }) => {
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
          type="text"
          placeholder="Search notes..."
          className="search-input"
        />
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
            </button>
          );
        })}
      </nav>

      <style>{`
        .sidebar {
          width: 260px;
          background-color: var(--color-bg-primary); /* Blend with main bg */
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
          padding: 10px 10px 10px 36px;
          border: 1px solid var(--color-bg-tertiary);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-tertiary); /* Use tertiary (lighter) for input bg in dark mode? No, let's keep it safe */
          background-color: var(--color-bg-primary); 
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--color-text-primary); /* This adapts, but if bg is primary, it's fine */
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(229, 152, 155, 0.1); /* Subtle rose focus ring */
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
          background-color: rgba(56, 178, 172, 0.15); /* Tinted accent bg (Teal) */
          color: var(--color-accent);
          font-weight: 500;
        }

        .nav-icon {
          opacity: 0.8;
        }

        .nav-item.active .nav-icon {
          opacity: 1;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
