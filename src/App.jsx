import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import EntryList from './components/EntryList';
import EntryForm from './components/EntryForm';
import EntryDetail from './components/EntryDetail';
import Settings from './components/Settings';

function App() {
  const [view, setView] = useState('library'); // 'library', 'add', 'settings', 'detail', 'edit'
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Initialize from LocalStorage or use default
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('morinote_entries');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        title: 'Starting Electron',
        excerpt: 'Electron combines Chromium and Node.js...',
        content: 'Electron is a framework for building desktop applications using JavaScript, HTML, and CSS.\nIt embeds Chromium and Node.js into its binary.',
        tags: ['electron', 'setup'],
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Persist to LocalStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('morinote_entries', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (entryToSave) => {
    if (entryToSave.id) {
      // Update existing
      setEntries(entries.map(e => e.id === entryToSave.id ? entryToSave : e));
      setSelectedEntry(entryToSave); // Update detail view immediately
      setView('detail');
    } else {
      // Create new
      setEntries([{ ...entryToSave, id: Date.now() }, ...entries]);
      setView('library');
    }
  };

  const handleDeleteEntry = (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setEntries(entries.filter(e => e.id !== id));
      if (selectedEntry && selectedEntry.id === id) {
        setView('library');
      }
    }
  };

  const handleImportData = (importedEntries) => {
    // Merge strategy: Add new ones, or replace? 
    // Simple strategy: Combine arrays, remove duplicates by ID? 
    // Given the ID generation is Date.now(), collisions are rare unless re-importing same file.
    // Let's just append new ones that don't share an ID.
    const existingIds = new Set(entries.map(e => e.id));
    const uniqueNew = importedEntries.filter(e => !existingIds.has(e.id));

    setEntries([...uniqueNew, ...entries]);
    alert(`Imported ${uniqueNew.length} new entries.`);
    setView('library');
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setView('detail');
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry); // Ensure it's selected
    setView('edit');
  };

  const renderContent = () => {
    switch (view) {
      case 'library':
        return <EntryList entries={entries} onSelectEntry={handleViewEntry} onDeleteEntry={handleDeleteEntry} />;
      case 'detail':
        return <EntryDetail entry={selectedEntry} onBack={() => setView('library')} onEdit={handleEditEntry} />;
      case 'add':
        return <EntryForm onSave={handleSaveEntry} onCancel={() => setView('library')} />;
      case 'edit':
        return <EntryForm initialData={selectedEntry} onSave={handleSaveEntry} onCancel={() => setView('detail')} />;
      case 'settings':
        return <Settings entries={entries} onImport={handleImportData} />;
      default:
        return <EntryList entries={entries} onSelectEntry={handleViewEntry} onDeleteEntry={handleDeleteEntry} />;
    }
  };

  return (
    <div className="layout">
      <Sidebar activeItem={view} onNavigate={setView} />
      <main className="main-content">
        {renderContent()}
      </main>

      <style>{`
        .layout {
          display: flex;
          height: 100vh;
          background-color: var(--color-bg-primary);
          background-image: radial-gradient(var(--color-bg-secondary) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .main-content {
          flex: 1;
          padding: var(--spacing-lg);
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}

export default App;
