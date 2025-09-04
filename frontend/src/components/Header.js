import React from 'react';

/**
 * Header renders the top navigation bar with brand, search, and "New Note" button.
 * @param {{onCreate: () => void, onSearch: (q:string)=>void, colorPalette: {primary:string, accent:string, secondary:string}}} props
 */
 // PUBLIC_INTERFACE
export default function Header({ onCreate, onSearch, colorPalette }) {
  return (
    <header className="header" style={{ '--primary': colorPalette.primary, '--accent': colorPalette.accent, '--secondary': colorPalette.secondary }}>
      <div className="header-inner">
        <div className="brand" aria-label="Personal Notes">
          <div className="brand-mark" />
          <span>Notes</span>
        </div>

        <div className="search" role="search">
          <span className="icon" aria-hidden>🔎</span>
          <input
            type="search"
            placeholder="Search notes..."
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Search notes"
          />
        </div>

        <div className="header-actions">
          <button className="btn" onClick={onCreate} aria-label="Create a new note">
            + New Note
          </button>
        </div>
      </div>
    </header>
  );
}
