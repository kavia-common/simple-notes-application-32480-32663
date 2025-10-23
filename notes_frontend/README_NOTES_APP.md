# Retro Notes (LightningJS Blits)

A simple retro-themed notes app using LightningJS (Blits) with Ocean Professional palette. Features:
- Header, notes list pane, and editor pane
- Create, select, edit, and delete notes
- Persistent storage via IndexedDB with localStorage fallback
- Smooth, modern-retro styling with rounded corners and subtle gradients
- Keyboard navigation and editing

## Run
- npm install
- npm run dev
The preview runs on port 3000 (as configured by the environment).

## Keyboard
- Arrow Up/Down: navigate notes in the list
- Enter: start editing (title), press Enter again to switch to content, press Enter to save
- A: add note
- Delete: delete active note
- Escape: back

## Structure
- src/theme.js: Theme and styling helpers
- src/utils/storage.js: IndexedDB + localStorage persistence
- src/components/Header.js: App header
- src/components/NotesList.js: Sidebar list
- src/components/NoteEditor.js: Viewer/Editor
- src/App.js: Application layout & logic
- src/pages/Home.js: Minimal footer banner and route presence

No external services are required.
