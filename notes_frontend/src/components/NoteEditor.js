import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'

export default Blits.Component('NoteEditor', {
  props: ['note'],
  state() {
    return {
      titleDraft: '',
      contentDraft: '',
      editing: false,
      cursor: 'title' // title or content
    }
  },
  watch: {
    note: {
      handler(n) {
        this.titleDraft = (n && n.title) || ''
        this.contentDraft = (n && n.content) || ''
        this.editing = false
        this.cursor = 'title'
      },
      immediate: true
    }
  },
  template: `
    <Element>
      <Element x="24" y="24" w="$w - 48" h="$h - 48" :color="${Theme.palette.surface}">
        <Element x="0" y="0" w="$w" h="$h" :color="${Theme.palette.surface}" />
        <Element x="0" y="0" w="$w" h="64" :color="${Theme.palette.primary}" :alpha="0.05" />
        <Text x="24" y="22" :content="titleLabel()" :fontSize="20" :textColor="${Theme.palette.textMuted}" />
        <Text x="24" y="52" :content="$titleDraft || 'Untitled'" :fontSize="28" :textColor="${Theme.palette.text}" />

        <Text x="24" y="100" content="Content" :fontSize="20" :textColor="${Theme.palette.textMuted}" />
        <Text x="24" y="132" :content="contentPreview()" :fontSize="22" :textColor="${Theme.palette.text}" />

        <Element x="$w - 360" y="18" w="320" h="40" :color="${Theme.palette.secondary}" :alpha="0.12" />
        <Text x="$w - 345" y="28" :content="actionHint()" :fontSize="20" :textColor="${Theme.palette.secondary}" />
      </Element>
    </Element>
  `,
  methods: {
    titleLabel() {
      return this.editing && this.cursor === 'title' ? 'Title (editing)' : 'Title'
    },
    contentPreview() {
      const text = this.contentDraft || ''
      return text.length > 300 ? text.slice(0, 300) + ' ...' : text
    },
    actionHint() {
      if (!this.note) return 'Press A to add a new note'
      if (!this.editing) return 'Press Enter to edit • Del to delete • A to add'
      return this.cursor === 'title' ? 'Type to edit title • Enter to switch' : 'Type to edit content • Enter to save'
    },
    // PUBLIC_INTERFACE
    startEditing() {
      /** Enable editing mode */
      if (!this.note) return
      this.editing = true
      this.cursor = 'title'
    },
    // PUBLIC_INTERFACE
    stopEditing() {
      /** Disable editing mode */
      this.editing = false
    },
    // PUBLIC_INTERFACE
    getDraft() {
      /** Returns current draft values */
      return { title: this.titleDraft, content: this.contentDraft }
    }
  },
  input: {
    enter() {
      if (!this.note) return
      if (!this.editing) {
        this.startEditing()
        return
      }
      if (this.cursor === 'title') {
        this.cursor = 'content'
      } else {
        this.stopEditing()
        this.emit('save', this.getDraft())
      }
    },
    back() {
      if (this.editing) {
        this.stopEditing()
      } else {
        this.parent.focus && this.parent.focus()
      }
    },
    up() {
      if (!this.editing) return
      this.cursor = 'title'
    },
    down() {
      if (!this.editing) return
      this.cursor = 'content'
    },
    any(e) {
      if (!this.editing) return
      const key = e && (e.key || e.code || '')
      if (!key) return
      if (key === 'Backspace') {
        if (this.cursor === 'title') this.titleDraft = this.titleDraft.slice(0, -1)
        else this.contentDraft = this.contentDraft.slice(0, -1)
        return
      }
      if (key === 'Delete') {
        this.emit('delete')
        return
      }
      if (key.length === 1) {
        if (this.cursor === 'title') this.titleDraft += key
        else this.contentDraft += key
      } else if (key === 'Space') {
        if (this.cursor === 'title') this.titleDraft += ' '
        else this.contentDraft += ' '
      }
    }
  }
})
