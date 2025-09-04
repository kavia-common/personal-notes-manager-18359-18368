import React from 'react';
import { formatDistanceToNow } from '../lib/time';

/**
 * Sidebar lists notes and allows selection and deletion.
 * @param {{notes: Array, selectedId: string|null, onSelect: (id:string)=>void, onDelete: (id:string)=>void}} props
 */
 // PUBLIC_INTERFACE
export default function Sidebar({ notes, selectedId, onSelect, onDelete }) {
  return (
    <div>
      <div className="note-list" role="list" aria-label="Notes list">
        {notes.length === 0 && (
          <div className="empty" style={{ minHeight: '40vh' }}>
            <div className="empty-inner">
              <h3>No notes yet</h3>
              <p>Create your first note to get started.</p>
            </div>
          </div>
        )}
        {notes.map(n => (
          <article
            key={n.id}
            className={`note-item ${selectedId === n.id ? 'active' : ''}`}
            onClick={() => onSelect(n.id)}
            role="listitem"
            aria-current={selectedId === n.id ? 'true' : 'false'}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelect(n.id); }}
          >
            <h4 className="note-item-title">{n.title || 'Untitled'}</h4>
            <div className="note-item-meta">
              <span title={new Date(n.updatedAt).toLocaleString()}>
                {formatDistanceToNow(n.updatedAt)} ago
              </span>
              <div className="note-item-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="icon-btn"
                  onClick={() => onDelete(n.id)}
                  aria-label="Delete note"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
