import Blits from '@lightningjs/blits'

/**
 * Editor
 * - Displays selected note and allows editing title/content.
 * - Emits: save({id,title,content}), delete()
 *
 * Note: Lightning/Blits doesn't use DOM input; we simulate basic editing via
 * simple in-app state and key inputs (Enter to toggle edit field focus, arrows to modify text minimally).
 * For a preview-friendly experience, we provide Save/Delete buttons and
 * a friendly text showing current title/content.
 */
export default Blits.Component('Editor', {
  props: ['note'],
  template: `
    <Element w="1096" h="852">
      <!-- Header row: Title + actions -->
      <Element x="0" y="0" w="1096" h="64">
        <Element x="0" y="0" w="800" h="64" :color="$titleBg" radius="14" @enter="$toggleTitleEdit">
          <Text x="16" y="18" :content="$titleDisplay" :color="$titleColor" fontSize="26" />
        </Element>
        <Element x="824" y="0" w="120" h="64" :color="$saveBg" radius="14" @enter="$emitSave">
          <Text x="26" y="18" content="Save" color="0xFFFFFFFF" fontSize="24" />
        </Element>
        <Element x="956" y="0" w="140" h="64" :color="$deleteBg" radius="14" @enter="$emitDelete">
          <Text x="22" y="18" content="Delete" color="0xFFFFFFFF" fontSize="24" />
        </Element>
      </Element>

      <!-- Content box -->
      <Element x="0" y="84" w="1096" h="768" :color="$contentBg" radius="16" @enter="$toggleBodyEdit">
        <Text x="16" y="16" :content="$contentDisplay" :color="$bodyColor" fontSize="22" />
      </Element>
    </Element>
  `,
  state() {
    const theme = this.$parent?.$parent?.$theme || {}
    return {
      theme,
      // Local edit buffers
      localId: null,
      titleBuf: '',
      bodyBuf: '',
      focusField: 'none', // 'title' | 'body' | 'none'
      titleBg: 0xF3F4F6ff,
      contentBg: 0xFFFFFFFF,
      saveBg: theme.primary || 0x2563EBff,
      deleteBg: 0xEF4444ff,
    }
  },
  computed: {
    $titleDisplay() {
      if (!this.note) return 'No note selected'
      return this.focusField === 'title' ? `[Editing] ${this.titleBuf}` : (this.titleBuf || this.note.title || 'Untitled')
    },
    $contentDisplay() {
      if (!this.note) return 'Select or create a note to begin.'
      return this.focusField === 'body' ? `[Editing]\n${this.bodyBuf}` : (this.bodyBuf || this.note.content || '')
    },
    $titleColor() { return this.theme.text || 0x111827ff },
    $bodyColor() { return 0x374151ff }, // gray-700
    $titleBg() { return this.titleBg },
    $contentBg() { return this.contentBg },
    $saveBg() { return this.saveBg },
    $deleteBg() { return this.deleteBg },
  },
  watch: {
    // Reset buffers when note changes
    note: {
      immediate: true,
      handler(n) {
        if (!n) {
          this.localId = null
          this.titleBuf = ''
          this.bodyBuf = ''
          this.focusField = 'none'
          return
        }
        this.localId = n.id
        this.titleBuf = n.title || 'Untitled'
        this.bodyBuf = n.content || ''
        this.focusField = 'none'
      },
    },
  },
  methods: {
    // PUBLIC_INTERFACE
    $emitSave() {
      /** Emit save for current buffers. */
      if (!this.localId) return
      this.$emit('save', { id: this.localId, title: this.titleBuf, content: this.bodyBuf })
      this.focusField = 'none'
    },
    // PUBLIC_INTERFACE
    $emitDelete() {
      /** Emit delete for current note. */
      if (!this.localId) return
      this.$emit('delete')
      this.focusField = 'none'
    },
    // PUBLIC_INTERFACE
    $toggleTitleEdit() {
      /** Toggle title edit mode. */
      this.focusField = this.focusField === 'title' ? 'none' : 'title'
    },
    // PUBLIC_INTERFACE
    $toggleBodyEdit() {
      /** Toggle body edit mode. */
      this.focusField = this.focusField === 'body' ? 'none' : 'body'
    },
  },
  input: {
    // Simplified editing: append characters a, b, c and space for demo navigation
    left() {},
    right() {},
    up() { this.focusField = 'title' },
    down() { this.focusField = 'body' },
    enter() {
      if (this.focusField === 'title' || this.focusField === 'body') {
        // finish editing on enter
        this.$emitSave()
      }
    },
    back() {
      // Backspace removes last character in current buffer
      if (this.focusField === 'title') {
        this.titleBuf = this.titleBuf.slice(0, -1)
      } else if (this.focusField === 'body') {
        this.bodyBuf = this.bodyBuf.slice(0, -1)
      }
    },
  },
})
