import React from 'react';

/**
 * EmptyState shows a helpful message and a call-to-action to create a note.
 * @param {{onCreate: ()=>void}} props
 */
 // PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  return (
    <div className="empty">
      <div className="empty-inner">
        <h3>Welcome to Notes</h3>
        <p>Capture ideas, todos, and thoughts. Everything is saved locally on your device.</p>
        <button className="btn" onClick={onCreate} aria-label="Create a new note">Create your first note</button>
      </div>
    </div>
  );
}
