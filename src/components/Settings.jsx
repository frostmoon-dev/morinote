import React, { useRef } from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';

const Settings = ({ entries, onImport }) => {
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `morinote_backup_${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (Array.isArray(importedData)) {
            if (confirm(`Found ${importedData.length} notes. This will merge with your existing notes. Continue?`)) {
              onImport(importedData);
            }
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Error parsing backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h2>Settings</h2>
      </header>

      <section className="settings-section">
        <h3><Database size={20} /> Data Management</h3>
        <p className="section-desc">Manage your local data. Export creates a backup file, Import restores it.</p>

        <div className="actions-grid">
          <div className="action-card">
            <h4>Export Data</h4>
            <p>Download all your notes as a JSON file.</p>
            <button className="btn btn-primary" onClick={handleExport}>
              <Download size={18} /> Export Backup
            </button>
          </div>

          <div className="action-card">
            <h4>Import Data</h4>
            <p>Restore notes from a backup file.</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json"
              onChange={handleFileChange}
            />
            <button className="btn btn-secondary" onClick={handleImportClick}>
              <Upload size={18} /> Import Backup
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .settings-page {
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: var(--spacing-xl);
          border-bottom: 2px solid var(--color-bg-tertiary);
          padding-bottom: var(--spacing-sm);
        }

        .settings-section {
          background: var(--color-bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-bg-tertiary);
        }

        .settings-section h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: var(--spacing-xs);
          color: var(--color-text-primary);
        }

        .section-desc {
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-lg);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }

        .action-card {
          background: var(--color-bg-tertiary);
          padding: var(--spacing-md);
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-bg-tertiary);
        }

        .action-card h4 {
          margin-bottom: var(--spacing-xs);
          color: var(--color-text-primary);
        }

        .action-card p {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-md);
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: var(--color-accent);
          color: white;
          border: none;
        }
        .btn-primary:hover {
          background-color: var(--color-accent-hover);
        }

        .btn-secondary {
          background-color: white;
          color: #1a1a1a;
          border: 1px solid var(--color-bg-tertiary);
        }
        .btn-secondary:hover {
          background-color: #f0f0f0;
          color: #1a1a1a;
        }
      `}</style>
    </div>
  );
};

export default Settings;
