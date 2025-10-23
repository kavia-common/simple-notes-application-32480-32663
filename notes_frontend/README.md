# Simple Notes - Lightning (Blits) Frontend

A modern "Ocean Professional" themed notes app built with LightningJS (Blits).
Supports creating, editing, viewing, and deleting notes with localStorage persistence.

## Features
- Ocean Professional theme (blue primary #2563EB, amber secondary #F59E0B)
- Header, notes list, and editor/viewer layout
- Create, select, edit, save, delete notes
- Persist notes to localStorage
- Seed note on first launch
- Smooth, rounded UI with subtle shadows

## Controls
- Use arrow keys to move focus:
  - Up: focus title editing
  - Down: focus body editing
- Enter on buttons/fields:
  - NotesList: Select item / Create (+ button)
  - Editor: Save (when focused) or toggle edit
- Backspace/Escape: go back or delete last character while editing
- The NotesList search prompt cycles through sample queries when pressing Enter while the list is focused (for preview environments without text input).

## Development
Already configured with Vite. To run:
```
npm install
npm run dev
```

The preview is available on the existing port configured for this container (3000).

## Notes
This app uses WebGL (Lightning/Blits). It does not use DOM inputs. Editing is simulated via simple key interactions and on-screen buttons.
