import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
            <style>{`
        .layout {
          display: flex;
          height: 100vh;
          background-color: var(--color-bg-primary);
          background-image: radial-gradient(var(--color-bg-secondary) 1px, transparent 1px);
          background-size: 20px 20px; /* Subtle dot pattern for texture */
        }

        .main-content {
          flex: 1;
          padding: var(--spacing-lg);
          overflow-y: auto;
          position: relative;
        }

        /* Scrollbar for main content */
        .main-content::-webkit-scrollbar {
          width: 8px;
        }
        .main-content::-webkit-scrollbar-thumb {
          background-color: var(--color-bg-tertiary);
          border-radius: 4px;
        }
      `}</style>
        </div>
    );
};

export default Layout;
