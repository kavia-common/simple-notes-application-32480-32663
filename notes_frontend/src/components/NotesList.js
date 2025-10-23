import Blits from '@lightningjs/blits'

/**
 * NotesList
 * - Shows search box (simulated), Add button, and list of notes.
 * - Emits: select({id}), create(), search({query})
 */
export default Blits.Component('NotesList', {
  props: ['notes', 'selectedId', 'query'],
  template: `
    <Element :color="$panelBg" w="600" h="852" radius="20">
      <!-- Header actions -->
      <Element x="16" y="16" w="568" h="56" :color="$chipBg" radius="16">
        <Text x="16" y="14" :content="$searchLabel" color="0x6B7280ff" fontSize="22" />
        <Text x="180" y="14" :content="$queryText" :color="$theme.text" fontSize="22" />
      </Element>

      <Element
        x="500" y="16" w="84" h="56"
        :color="$theme.primary" radius="16"
        @enter="$emitCreate"
      >
        <Text x="26" y="14" content="+" color="0xFFFFFFFF" fontSize="28" />
      </Element>

      <!-- List -->
      <Element x="16" y="88" w="568" h="748" :color="$listBg" radius="16">
        <Element
          :for="(item, index) in $items"
          :key="$item.id"
          :x="12"
          :y="$index * 92 + 12"
          w="544"
          h="80"
          :color="$itemColor($item)"
          radius="14"
          @enter="$emitSelect($item.id)"
        >
          <Text x="16" y="14" :content="$item.title || 'Untitled'" :color="$titleColor($item)" fontSize="24" />
          <Text x="16" y="46" :content="$preview($item.content)" color="0x6B7280ff" fontSize="18" />
        </Element>
      </Element>
    </Element>
  `,
  state() {
    const theme = this.$parent?.$parent?.$theme || {}
    return {
      theme,
      panelBg: 0xF3F4F6ff, // gray-100
      listBg: 0xFFFFFFFF,
      chipBg: 0xF9FAFBff,
      searchLabel: 'Search:',
    }
  },
  computed: {
    $theme() { return this.theme },
    $items() { return this.notes || [] },
    $queryText() { return (this.query || '').length ? this.query : 'Type to filter (Enter to apply)' },
  },
  methods: {
    $preview(text) {
      const t = (text || '').replace(/\n/g, ' ')
      return t.length > 50 ? t.slice(0, 50) + '…' : t
    },
    $itemColor(item) {
      const selected = item.id === this.selectedId
      return selected ? this.theme.primary : 0xF9FAFBff
    },
    $titleColor(item) {
      const selected = item.id === this.selectedId
      return selected ? 0xFFFFFFFF : this.theme.text
    },
    // PUBLIC_INTERFACE
    $emitSelect(id) {
      /** Emit select event with note id. */
      this.$emit('select', { id })
    },
    // PUBLIC_INTERFACE
    $emitCreate() {
      /** Emit create event. */
      this.$emit('create')
    },
  },
  input: {
    enter() {
      // When focused, pressing enter toggles "apply search".
      // We simulate simple inline search entry via this.$app.keyboard?.lastText? not available,
      // so for simplicity, we cycle sample queries for demo purposes.
      const samples = ['', 'welcome', 'untitled']
      const idx = samples.indexOf(this.query || '')
      const next = samples[(idx + 1) % samples.length]
      this.$emit('search', { query: next })
    },
    up() {},
    down() {},
    left() {},
    right() {},
    back() {},
  },
})
