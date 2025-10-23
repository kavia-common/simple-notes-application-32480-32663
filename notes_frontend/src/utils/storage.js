const DB_NAME = 'notes_db'
const STORE_NAME = 'notes_store'
const DB_VERSION = 1

/**
 * Simple model for a note
 * { id: string, title: string, content: string, updatedAt: number, createdAt: number }
 */

function uuid() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
  } catch (e) {
    // crypto may not be available in all environments; will fall back
  }
  // Fallback UUID (RFC4122-ish simple)
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

function openIndexedDB() {
  return new Promise((resolve) => {
    if (!('indexedDB' in globalThis)) return resolve(null)
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('updatedAt', 'updatedAt')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => resolve(null) // fall back to localStorage
  })
}

async function withStore(mode, fn) {
  const db = await openIndexedDB()
  if (!db) return null
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    const done = (res) => { resolve(res) }
    tx.oncomplete = () => {}
    tx.onerror = () => reject(tx.error)
    fn(store, done)
  })
}

// PUBLIC_INTERFACE
export async function getAllNotes() {
  /** Returns all notes from persistent storage, sorted by updatedAt DESC. */
  const res = await withStore('readonly', (store, done) => {
    const req = store.getAll()
    req.onsuccess = () => {
      const data = req.result || []
      data.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      done(data)
    }
    req.onerror = () => done([])
  })
  if (res) return res

  // Fallback to localStorage
  try {
    const raw = localStorage.getItem('notes') || '[]'
    const arr = JSON.parse(raw)
    arr.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    return arr
  } catch {
    return []
  }
}

// PUBLIC_INTERFACE
export async function saveNote(note) {
  /** Creates or updates a note. Returns the saved note. */
  const toSave = {
    ...note,
    id: note.id || uuid(),
    updatedAt: Date.now(),
    createdAt: note.createdAt || Date.now()
  }

  const ok = await withStore('readwrite', (store, done) => {
    const req = store.put(toSave)
    req.onsuccess = () => done(true)
    req.onerror = () => done(false)
  })
  if (ok !== null) return toSave

  // Fallback localStorage
  try {
    const current = await getAllNotes()
    const idx = current.findIndex(n => n.id === toSave.id)
    if (idx >= 0) current[idx] = toSave
    else current.unshift(toSave)
    localStorage.setItem('notes', JSON.stringify(current))
    return toSave
  } catch {
    return toSave
  }
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  /** Deletes a note by id. Returns true on success. */
  const ok = await withStore('readwrite', (store, done) => {
    const req = store.delete(id)
    req.onsuccess = () => done(true)
    req.onerror = () => done(false)
  })
  if (ok !== null) return ok

  try {
    const current = await getAllNotes()
    const filtered = current.filter(n => n.id !== id)
    localStorage.setItem('notes', JSON.stringify(filtered))
    return true
  } catch {
    return false
  }
}

// PUBLIC_INTERFACE
export async function ensureSeedNote() {
  /** Ensures there is at least one note on first run. Returns notes array. */
  const notes = await getAllNotes()
  if (notes.length > 0) return notes
  const seed = {
    title: 'Welcome to Retro Notes',
    content: 'This is your first note. Use the left pane to navigate notes.\n- Enter to edit\n- Back to go back\n- Use arrow keys to move\n\nHave fun!',
  }
  const saved = await saveNote(seed)
  return [saved]
}
