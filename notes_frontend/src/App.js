import Blits from '@lightningjs/blits'
import themePlugin, { Theme } from './theme.js'
import Home from './pages/Home.js'
import Header from './components/Header.js'
import NotesList from './components/NotesList.js'
import NoteEditor from './components/NoteEditor.js'
import { ensureSeedNote, getAllNotes, saveNote, deleteNote } from './utils/storage.js'

export default Blits.Application({
  name: 'Retro Notes',
  plugins: [themePlugin],
  template: `
    <Element :color="${Theme.palette.background}">
      <Header />
      <Element x="24" y="108" w="$w - 48" h="$h - 132" :color="${Theme.palette.surface}">
        <Element x="0" y="0" w="$w" h="$h" :color="${Theme.palette.surface}" />
        <!-- Sidebar -->
        <Element x="0" y="0" :w="$sidebarW" h="$h" :color="${Theme.palette.surface}">
          <Element x="0" y="0" :w="$sidebarW" h="64" :color="${Theme.palette.primary}" :alpha="0.08" />
          <Text x="24" y="24" content="Notes" :fontSize="22" :textColor="${Theme.palette.text}" />
          <Element x="0" y="64" :w="$sidebarW" :h="$h - 64" :color="${Theme.palette.surface}">
            <NotesList :items="$notes" :activeId="$activeId" @select="$handleSelect" />
          </Element>
        </Element>
        <!-- Editor Pane -->
        <Element :x="$sidebarW + 8" y="0" :w="$contentW" h="$h" :color="${Theme.palette.surface}">
          <NoteEditor :note="$activeNote" @save="$handleSave" @delete="$handleDelete" />
        </Element>
        <!-- Footer actions -->
        <Element x="0" :y="$h - 44" w="$w" h="44" :color="${Theme.palette.primary}" :alpha="0.06">
          <Text x="24" y="14" content="[A] Add  [Enter] Edit/Save  [Del] Delete  [Arrow] Navigate" :fontSize="18" :textColor="${Theme.palette.textMuted}" />
        </Element>
      </Element>
      <RouterView />
    </Element>
  `,
  components: { Header, NotesList, NoteEditor },
  routes: [{ path: '/', component: Home }],
  state() {
    return {
      notes: [],
      activeId: null
    }
  },
  computed: {
    activeNote() {
      return (this.notes || []).find(n => n.id === this.activeId) || null
    },
    sidebarW() {
      const min = 360
      const calc = Math.floor(this.w * 0.28)
      return Math.max(min, calc)
    },
    contentW() {
      return this.w - this.sidebarW - 32 // 24 left pad + 8 gutter already accounted in parent
    }
  },
  async mounted() {
    const loaded = await ensureSeedNote()
    this.notes = loaded
    this.activeId = loaded[0]?.id || null
  },
  methods: {
    // PUBLIC_INTERFACE
    async refreshNotes() {
      /** Reload the notes from storage to reflect latest changes. */
      this.notes = await getAllNotes()
      if (!this.activeId && this.notes.length > 0) {
        this.activeId = this.notes[0].id
      } else if (this.activeId && !this.notes.find(n => n.id === this.activeId)) {
        this.activeId = this.notes[0]?.id || null
      }
    },
    // PUBLIC_INTERFACE
    async handleSelect(note) {
      /** Select a note in the list. */
      this.activeId = note?.id || null
    },
    // PUBLIC_INTERFACE
    async handleSave(draft) {
      /** Save current note with provided draft, persist, and refresh. */
      if (!this.activeNote) return
      await saveNote({ ...this.activeNote, ...draft })
      await this.refreshNotes()
    },
    // PUBLIC_INTERFACE
    async handleDelete() {
      /** Delete the active note and refresh list. */
      if (!this.activeNote) return
      await deleteNote(this.activeNote.id)
      await this.refreshNotes()
    },
    // PUBLIC_INTERFACE
    async addNote() {
      /** Add a new empty note and select it. */
      const created = await saveNote({ title: 'New Note', content: '' })
      await this.refreshNotes()
      this.activeId = created.id
    }
  },
  input: {
    any(e) {
      const key = e && (e.key || e.code || '')
      if (key === 'a' || key === 'A') {
        this.addNote()
      }
      if (key === 'Delete') {
        this.handleDelete()
      }
    }
  }
})
