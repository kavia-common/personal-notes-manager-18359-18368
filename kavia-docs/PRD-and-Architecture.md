# Personal Notes App — PRD and Architecture Overview

## Introduction

### Background
This document defines the product requirements and frontend architecture for a modern, light-themed Notes web application. The app enables users to create, view, edit, and delete personal notes within a clean, responsive UI. The current implementation is a React single-page application that persists data locally in the browser for a fast and private experience.

### Scope
The scope of this document covers the React frontend, including user experience, UI layout, component structure, client-side data management, and data flow. While a backend is not required for the initial release, this document also outlines an optional path for future extensibility.

## Product Requirements

### Goals
- Allow users to create, view, edit, and delete notes quickly and intuitively.
- Provide a modern, light-themed interface with responsive layout.
- Persist notes locally in the browser to work without sign-in.
- Offer an approachable foundation that can be extended with features like tags, syncing, and authentication later.

### Non-Goals (Initial Release)
- Multi-user support and server-side storage.
- Rich text formatting or attachments.
- Complex organization features like folders or tags.
- Offline sync across devices.

## Feature Set

### Create Notes
- Users can create a new note from the header via a “+ New Note” button.
- New notes should be immediately persisted locally and selected for editing.
- Generated default values:
  - Title: empty string or “Untitled”.
  - Content: empty string.
  - Metadata: createdAt and updatedAt timestamps.

### View Notes
- Users can browse a list of notes in the left sidebar.
- The list displays each note’s title and relative last-updated timestamp.
- Selecting a note makes it active and displays it in the editor view.

### Edit Notes
- Users can edit title and content in the main editor pane.
- Edits are persisted automatically with slight debouncing to avoid excessive writes.
- The editor footer shows created and last updated times.

### Delete Notes
- Users can delete a note from the sidebar item or from the editor.
- After deletion, if the deleted note was selected, the app selects the next available note or shows an empty state if no notes remain.

### Search (Basic)
- A search input in the header filters the visible notes list by title or content in real time.
- Filtering does not permanently alter the stored data.

## UI and Styling

### Theme and Colors
- Light theme with neutral base colors.
- Primary: #3F51B5
- Accent: #E91E63
- Secondary: #FFC107
- The current CSS tokens define a modern light palette with a neutral monochrome base. To align with the requested brand colors, the following can be layered in:
  - Primary actions and focus accents can use #3F51B5.
  - Secondary emphasis (e.g., selection highlights) can use #FFC107 sparingly.
  - Destructive or accent actions (e.g., delete) can integrate #E91E63 in hover/focus states.

Note: The present CSS in src/App.css primarily uses a neutral palette and tokens like --mono-*. Incorporating the brand colors can be achieved by extending the token set (for example --color-primary, --color-accent, --color-secondary) and applying them to buttons, focus rings, and active states.

### Layout
- Header bar at the top: brand block, search field, and “+ New Note” button.
- Sidebar on the left: scrollable list of notes with selection and delete action.
- Main area on the right: editor with title input, content textarea, and footer showing timestamps.
- Responsive behavior: On narrow screens, the main editor appears above and the sidebar below, stacked vertically.

### Accessibility
- Interactive elements have accessible names and roles.
- Keyboard navigation support in the sidebar (Enter selects note).
- Adequate contrast and visible focus states.

## User Flows

### 1. First-time User
1. User opens the app and sees the empty state in the main area.
2. User clicks “Create your first note” or “+ New Note”.
3. App creates a new note, selects it, and focuses the editor.

### 2. Returning User
1. App loads notes from local storage and selects the most recent or first note by default.
2. User browses notes in the sidebar and selects one to view/edit.

### 3. Editing a Note
1. With a note selected, the user types into the title or content fields.
2. The app debounces and persists the updates locally.
3. The updated timestamp updates; sidebar reflects relative time.

### 4. Deleting a Note
1. User clicks delete in the sidebar item or the editor footer.
2. The note is removed from local data and UI updates.
3. If the deleted note was selected, the app selects the next available note or shows empty state.

## Architecture Overview

### Component Structure (React)

- App
  - Header
  - Sidebar
  - NoteEditor (or EmptyState)

Responsibilities:
- App: Root container; owns the notes array, selectedId, and search query; orchestrates CRUD operations and persistence via a notes library.
- Header: Presents brand, search input, and “+ New Note” button; raises search text changes and create events.
- Sidebar: Renders the list of notes; emits select and delete events.
- NoteEditor: Manages controlled inputs for title and content, debouncing updates and displaying metadata.
- EmptyState: Encourages note creation when no note is selected or exists.

### Data Model (Frontend)
- Note
  - id: string
  - title: string
  - content: string
  - createdAt: number (epoch ms)
  - updatedAt: number (epoch ms)

### State Ownership
- App component owns:
  - notes: Note[]
  - selectedId: string | null
  - query: string
- Derived State:
  - selectedNote: derived via selectedId.
  - filteredNotes: memoized list based on query.

### Data Persistence
- Local storage is used for persistence:
  - On mount: migrateIfNeeded(); then storage.load() to initialize.
  - On notes change: storage.save(notes).
- Reducer-style updates are applied using notesReducer for immutable updates.

### Data Flow

- Create
  - Header triggers onCreate -> App calls createNewNote, updates notes state, selects new note.
- Read
  - Sidebar receives filteredNotes and renders items; selection drives which note editor shows.
- Update
  - NoteEditor changes title/content -> debounced onChange -> App calls notesReducer(update).
- Delete
  - Sidebar or NoteEditor triggers onDelete -> App filters out note, updates selectedId accordingly.

```mermaid
flowchart LR
  A["Header (+ New Note, Search)"] -->|onCreate| B["App (notes, selectedId, query)"]
  C["Sidebar (list)"] -->|onSelect| B
  D["NoteEditor (title, content)"] -->|onChange (debounced)| B

  B -->|props.notes, props.selectedId| C
  B -->|props.note| D
  B -->|filter by query| C
  C -->|onDelete(id)| B
  D -->|onDelete()| B

  B -->|save(notes)| E["LocalStorage"]
  E -->|load() on mount| B
```

## UI Composition and Layout

### Header
- Brand mark and name on the left.
- Search input centered; filters notes in real-time.
- Primary action button “+ New Note” on the right.

### Sidebar
- Scrollable vertical list of notes with item containers.
- Each item displays title and “updated X ago”.
- Delete icon button on each item.
- Selected item is visually emphasized.

### Main Editor
- Title input at top.
- Multiline textarea below.
- Footer shows created/updated timestamps and a secondary Delete button.

## Frontend Data Management

### Current Approach (Frontend-only)
- Local storage via a small library (migrateIfNeeded, storage.load, storage.save, notesReducer, createNewNote).
- Advantages:
  - Simplicity, privacy, no network dependency.
  - Instant interactions with debounce to avoid excessive writes.
- Considerations:
  - Data is device-local and not synced across devices.
  - Storage capacity limitations.

### Extensibility Options (Future)
- Backend API
  - Add a lightweight REST or GraphQL service for notes.
  - Introduce authentication to support multi-device syncing.
  - Implement optimistic UI updates with background sync and retry.
- IndexedDB
  - Migrate storage from localStorage to IndexedDB for larger capacity and structured queries.
- Feature Additions
  - Tags, pinning, sorting, and archiving.
  - Rich text editing and attachments.
  - Import/export and backups.

## Quality and Testing

### Performance
- Minimally stateful components with memoized selectors for filtered lists.
- Debounced editor updates to reduce write frequency.

### Testing Ideas
- Render smoke tests: header brand, sidebar rendering, empty state.
- CRUD flows: create and select note, edit content, delete note behavior.
- Search: verify filter correctness and case-insensitivity.

## Release Plan

### v0.1 (Current)
- Local-only notes with create, view, edit, delete.
- Light theme and responsive layout.
- Basic search in header.

### v0.2+
- Theming tokens for primary/accent/secondary colors integration throughout UI.
- Optional migration to IndexedDB.
- Tagging and pinning.
- Export/import.

## Appendix

### Directory Overview (Frontend)
- src/App.js: Root app, state management, layout composition.
- src/components/Header.js: Brand, search, create action.
- src/components/Sidebar.js: Notes list, select, delete.
- src/components/NoteEditor.js: Title/content editing, timestamps, delete.
- src/components/EmptyState.js: Getting started prompt.
- src/App.css: Light theme tokens and layout styling.
- src/index.js, src/index.css: App entry and baseline styles.

### Styling Tokens Suggestion (for brand colors)
Add to :root:
- --color-primary: #3F51B5
- --color-accent: #E91E63
- --color-secondary: #FFC107

Use them for:
- Primary button background and focus ring.
- Active list item border or background accents.
- Destructive button hover/focus states.

## Conclusion

### Summary
This PRD and architecture overview captures the current app’s MVP—local, fast CRUD notes—alongside a clear, extensible component architecture and data flow. The light theme layout is simple and modern, with clear paths to incorporate brand colors and evolve toward richer features and optional server-backed syncing in future iterations.
