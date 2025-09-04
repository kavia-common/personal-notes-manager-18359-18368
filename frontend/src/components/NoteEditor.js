import React, { useEffect, useState } from 'react';
import { formatFullDate } from '../lib/time';

/**
 * NoteEditor provides inputs to edit a note's title and content.
 * @param {{note: {id:string,title:string,content:string,createdAt:number,updatedAt:number}, onChange: (partial: object)=>void, onDelete: ()=>void}} props
 */
 // PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onDelete }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
  }, [note.id]); // reset when selecting a different note

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange({
        title,
        content,
        updatedAt: Date.now()
      });
    }, 250); // debounce updates slightly
    return () => clearTimeout(handler);
  }, [title, content]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="editor-card">
      <input
        className="editor-title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Note title"
      />
      <textarea
        className="editor-textarea"
        placeholder="Start typing your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Note content"
      />
      <div className="editor-footer">
        <span>
          Created: {formatFullDate(note.createdAt)} • Updated: {formatFullDate(note.updatedAt)}
        </span>
        <div>
          <button className="btn secondary" onClick={onDelete} aria-label="Delete current note" title="Delete note">
            Delete
          </button>
        </div>
      </div>
    </section>
  );
}
