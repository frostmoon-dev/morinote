import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu } from 'lucide-react';
import Toast from './components/Toast';
import Sidebar from './components/Sidebar';
import EntryList from './components/EntryList';
import EntryForm from './components/EntryForm';
import EntryDetail from './components/EntryDetail';
import Settings from './components/Settings';
import ConfirmDialog from './components/ConfirmDialog';

function App() {
  const [view, setView] = useState('library'); // 'library', 'add', 'settings', 'detail', 'edit'
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const searchInputRef = useRef(null);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    entryId: null,
    entryTitle: ''
  });

  // Discard changes confirmation dialog
  const [discardDialog, setDiscardDialog] = useState({
    isOpen: false,
    targetView: null, // where the user wanted to go
    resetSelected: false
  });

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+N: New note
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        setSelectedEntry(null);
        setView('add');
      }
      // Escape: Go back
      if (e.key === 'Escape') {
        if (view === 'detail') setView('library');
        else if (view === 'add' || view === 'edit') {
          // Only go back if not in editor textarea
          if (document.activeElement?.tagName !== 'TEXTAREA') {
            setView(view === 'edit' ? 'detail' : 'library');
          }
        }
      }
      // /: Focus search (when not in input)
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setView('library');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  // Filter entries based on search and tag
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm ||
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag = !selectedTag || entry.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = [...new Set(entries.flatMap(e => e.tags))];

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

    // Show success toast
    setToast({
      isVisible: true,
      message: 'Note saved successfully!',
      type: 'success'
    });

    setIsFormDirty(false);
  };

  const handleDeleteEntry = (id) => {
    const entry = entries.find(e => e.id === id);
    setDeleteDialog({
      isOpen: true,
      entryId: id,
      entryTitle: entry?.title || 'this entry'
    });
  };

  const confirmDelete = () => {
    const id = deleteDialog.entryId;
    setEntries(entries.filter(e => e.id !== id));
    if (selectedEntry && selectedEntry.id === id) {
      setView('library');
    }
    setDeleteDialog({ isOpen: false, entryId: null, entryTitle: '' });
    setToast({ isVisible: true, message: 'Note deleted.', type: 'info' });
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, entryId: null, entryTitle: '' });
  };

  const handleImportData = (importedEntries) => {
    const existingIds = new Set(entries.map(e => e.id));
    const uniqueNew = importedEntries.filter(e => !existingIds.has(e.id));

    setEntries([...uniqueNew, ...entries]);
    setToast({ isVisible: true, message: `Imported ${uniqueNew.length} new entries.`, type: 'success' });
    setView('library');
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setView('detail');
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setView('edit');
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setView('library');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
  };

  // Update entry content (used for interactive checkboxes)
  const handleUpdateContent = useCallback((entryId, newContent) => {
    setEntries(prev => prev.map(e =>
      e.id === entryId ? { ...e, content: newContent } : e
    ));
    // Also update selectedEntry if it's the one being modified
    if (selectedEntry && selectedEntry.id === entryId) {
      setSelectedEntry(prev => ({ ...prev, content: newContent }));
    }
  }, [selectedEntry]);

  const renderContent = () => {
    switch (view) {
      case 'library':
        return (
          <EntryList
            entries={filteredEntries}
            onSelectEntry={handleViewEntry}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            allTags={allTags}
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
            searchTerm={searchTerm}
            onClearFilters={clearFilters}
          />
        );
      case 'detail':
        return <EntryDetail entry={selectedEntry} onBack={() => setView('library')} onEdit={handleEditEntry} onUpdateContent={handleUpdateContent} />;
      case 'add':
        return <EntryForm onSave={handleSaveEntry} onCancel={() => handleNavigate('library')} onDirtyChange={setIsFormDirty} />;
      case 'edit':
        return <EntryForm initialData={selectedEntry} onSave={handleSaveEntry} onCancel={() => handleNavigate('detail')} onDirtyChange={setIsFormDirty} />;
      case 'settings':
        return <Settings entries={entries} onImport={handleImportData} />;
      default:
        return <EntryList entries={filteredEntries} onSelectEntry={handleViewEntry} onDeleteEntry={handleDeleteEntry} />;
    }
  };

  // Handle navigation with proper state reset
  const handleNavigate = (destination) => {
    // If dirty, intercept navigation
    if (isFormDirty) {
      setDiscardDialog({
        isOpen: true,
        targetView: destination,
        resetSelected: destination === 'add'
      });
      return;
    }

    if (destination === 'add') {
      setSelectedEntry(null); // Reset for fresh form
    }
    setView(destination);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const confirmDiscard = () => {
    setIsFormDirty(false); // Allow navigation
    setDiscardDialog({ isOpen: false, targetView: null, resetSelected: false });

    const { targetView, resetSelected } = discardDialog;
    if (resetSelected) setSelectedEntry(null);
    setView(targetView);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="layout">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
        <Menu size={24} />
      </button>

      <Sidebar
        activeItem={view}
        onNavigate={handleNavigate}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchInputRef={searchInputRef}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <main className="main-content">
        {renderContent()}
      </main>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteDialog.entryTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={discardDialog.isOpen}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to discard them and leave?"
        confirmText="Discard Changes"
        cancelText="Keep Editing"
        onConfirm={confirmDiscard}
        onCancel={() => setDiscardDialog({ isOpen: false, targetView: null })}
        variant="warning"
      />

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <style>{`
        .layout {
          display: flex;
          height: 100vh;
          background-color: var(--color-bg-primary);
          background-image: radial-gradient(var(--color-bg-secondary) 1px, transparent 1px);
          background-size: 20px 20px;
          position: relative;
        }
        .main-content {
          flex: 1;
          padding: var(--spacing-lg);
          overflow-y: auto;
          width: 100%; /* Ensure content takes full width */
        }

        .mobile-menu-btn {
          display: none;
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 50;
          background: white;
          border: 1px solid var(--color-bg-tertiary);
          padding: 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--color-text-primary);
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Add padding to main content to account for the menu button */
          .main-content {
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
