import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { createNewNote, migrateIfNeeded, notesReducer, storage } from './lib/notes';

/**
 * App is the root component hosting the layout (header, sidebar, main content)
 * and managing the notes state and selection.
 */
// PUBLIC_INTERFACE
function App() {
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');

  // Initialize from localStorage and migrate if needed
  useEffect(() => {
    migrateIfNeeded();
    const initial = storage.load();
    setNotes(initial);
    if (initial.length) setSelectedId(initial[0].id);
  }, []);

  // Persist notes to localStorage
  useEffect(() => {
    storage.save(notes);
  }, [notes]);

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // PUBLIC_INTERFACE
  const handleCreate = () => {
    const { note, updated } = createNewNote(notes);
    setNotes(updated);
    setSelectedId(note.id);
  };

  // PUBLIC_INTERFACE
  const handleDelete = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (id === selectedId) {
      const remaining = notes.filter(n => n.id !== id);
      setSelectedId(remaining.length ? remaining[0].id : null);
    }
  };

  // PUBLIC_INTERFACE
  const handleUpdate = (id, partial) => {
    setNotes(prev => notesReducer(prev, { type: 'update', id, partial }));
  };

  // PUBLIC_INTERFACE
  const handleSelect = (id) => setSelectedId(id);

  const filteredNotes = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  return (
    <div className="app-root light-theme">
      <Header
        onCreate={handleCreate}
        onSearch={setQuery}
      />
      <div className="layout">
        <aside className="sidebar">
          <Sidebar
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        </aside>
        <main className="main">
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onChange={(partial) => handleUpdate(selectedNote.id, partial)}
              onDelete={() => handleDelete(selectedNote.id)}
            />
          ) : (
            <EmptyState onCreate={handleCreate} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
