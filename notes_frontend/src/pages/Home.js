import Blits from '@lightningjs/blits'
import Header from '../components/Header.js'
import NotesList from '../components/NotesList.js'
import Editor from '../components/Editor.js'

const STORAGE_KEY = 'simple-notes-v1'

/**
 * Home page orchestrates the layout:
 * - Header (top)
 * - Main content with NotesList (left) and Editor (right)
 * Handles persistence to localStorage and selection state.
 */
export default Blits.Component('Home', {
  components: { Header, NotesList, Editor },
  template: `
    <Element w="1920" h="1080" :color="$theme.background">
      <Header x="60" y="40" />

      <!-- Main Surface Card -->
      <Element
        x="60" y="140" w="1800" h="900"
        :color="$theme.surface"
        radius="24"
      >
        <!-- Subtle shadow border layer -->
        <Element x="0" y="0" w="1800" h="900" :color="$shadowColor" radius="24" alpha="0.08" />

        <!-- Left: Notes list panel -->
        <NotesList
          x="24" y="24"
          w="600" h="852"
          :notes="$filteredNotes"
          :selectedId="$selectedId"
          :query="$query"
          @select="$onSelect"
          @create="$onCreate"
          @search="$onSearch"
        />

        <!-- Divider -->
        <Element x="648" y="24" w="2" h="852" color="0xE5E7EBff" alpha="1" />

        <!-- Right: Editor -->
        <Editor
          x="680" y="24"
          w="1096" h="852"
          :note="$activeNote"
          @save="$onSave"
          @delete="$onDelete"
        />
      </Element>
    </Element>
  `,
  state() {
    const theme = this.$parent?.$theme || {
      primary: 0x2563EBff, secondary: 0xF59E0Bff, background: 0xF9FAFBff,
      surface: 0xFFFFFFFF, text: 0x111827ff,
    }

    // Load persisted notes or seed a first note
    let stored = []
    try {
      const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
      stored = raw ? JSON.parse(raw) : []
    } catch (err) {
      // Fallback to empty list if parsing or access fails
      stored = []
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Failed to read notes from localStorage:', err)
      }
    }
    if (!stored || stored.length === 0) {
      stored = [
        {
          id: `seed-${Date.now()}`,
          title: 'Welcome to Simple Notes',
          content:
            'This is your first note.\n\n- Create new notes with the + button\n- Select a note to edit on the right\n- Your notes persist automatically',
          updatedAt: Date.now(),
        },
      ]
      try {
        globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(stored))
      } catch (err) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('Failed to seed notes to localStorage:', err)
        }
      }
    }

    return {
      theme,
      notes: stored,
      selectedId: stored[0]?.id || null,
      query: '',
      shadowColor: 0x000000ff,
    }
  },
  computed: {
    $theme() { return this.theme },
    $shadowColor() { return this.shadowColor },
    $activeNote() { return this.notes.find(n => n.id === this.selectedId) || null },
    $filteredNotes() {
      const q = (this.query || '').trim().toLowerCase()
      if (!q) return this.sortedNotes(this.notes)
      return this.sortedNotes(this.notes.filter(n =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q)
      ))
    },
  },
  methods: {
    sortedNotes(list) {
      return [...list].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    },
    persist() {
      try {
        globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(this.notes))
      } catch (err) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('Failed to persist notes to localStorage:', err)
        }
      }
    },
    // PUBLIC_INTERFACE
    $onSelect(e) {
      /** Select note by id. */
      this.selectedId = e?.detail?.id || null
    },
    // PUBLIC_INTERFACE
    $onCreate() {
      /** Create a new note and focus editor */
      const id = `note-${Date.now()}`
      const newNote = {
        id, title: 'Untitled', content: '', updatedAt: Date.now(),
      }
      this.notes = [newNote, ...this.notes]
      this.selectedId = id
      this.persist()
    },
    // PUBLIC_INTERFACE
    $onSave(e) {
      /** Save updates to a note */
      const { id, title, content } = e.detail || {}
      this.notes = this.notes.map(n => (n.id === id ? { ...n, title, content, updatedAt: Date.now() } : n))
      this.persist()
    },
    // PUBLIC_INTERFACE
    $onDelete() {
      /** Delete the currently selected note */
      const id = this.selectedId
      if (!id) return
      this.notes = this.notes.filter(n => n.id !== id)
      this.selectedId = this.notes[0]?.id || null
      this.persist()
    },
    // PUBLIC_INTERFACE
    $onSearch(e) {
      /** Update search query for filtering notes */
      this.query = e?.detail?.query || ''
    },
  },
  input: {
    // Keyboard shortcuts: N to create, Delete to delete
    enter() {},
    left() {},
    right() {},
    up() {},
    down() {},
    back() {},
  },
})
