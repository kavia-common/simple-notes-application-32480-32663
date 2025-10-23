import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'

export default Blits.Component('NotesList', {
  props: ['items', 'activeId'],
  computed: {
    computedItems() { return this.items || [] }
  },
  template: `
    <Element>
      <Element 
        :for="(item, index) in $computedItems" 
        :key="$item.id"
        x="0"
        :y="20 + $index * 84"
        w="$w"
        h="72"
        :color="${Theme.palette.surface}"
        :alpha="1"
      >
        <Element x="0" y="0" w="$w" h="72" :color="${Theme.palette.surface}" />
        <Element x="0" y="71" w="$w" h="1" :color="${Theme.palette.border}" />
        <Element x="12" y="12" w="$w - 24" h="48" :color="${Theme.palette.primary}" :alpha="(($item.id === $props.activeId) ? 0.12 : 0)" />
        <Text x="20" y="24" :content="$item.title || 'Untitled'" :fontSize="22" :textColor="${Theme.palette.text}" />
        <Text x="$w - 140" y="26" :content="formatDate($item.updatedAt)" :fontSize="18" :textColor="${Theme.palette.textMuted}" />
      </Element>
    </Element>
  `,
  methods: {
    // PUBLIC_INTERFACE
    formatDate(ts) {
      /** Return a short, human-friendly date string */
      if (!ts) return ''
      const d = new Date(ts)
      return d.toLocaleString()
    },
    // PUBLIC_INTERFACE
    selectByIndex(idx) {
      /** Emits 'select' with the item at index if valid */
      const item = (this.items || [])[idx]
      if (item) this.emit('select', item)
    }
  },
  input: {
    up() {
      if (!this.items || this.items.length === 0) return
      const currentIndex = (this.items || []).findIndex(n => n.id === this.activeId)
      const idx = Math.max(0, currentIndex - 1)
      this.selectByIndex(idx)
    },
    down() {
      if (!this.items || this.items.length === 0) return
      const currentIndex = (this.items || []).findIndex(n => n.id === this.activeId)
      const idx = Math.min(this.items.length - 1, currentIndex + 1)
      this.selectByIndex(idx)
    },
    enter() {
      const idx = (this.items || []).findIndex(n => n.id === this.activeId)
      this.selectByIndex(idx >= 0 ? idx : 0)
    }
  }
})
