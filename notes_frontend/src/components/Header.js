import Blits from '@lightningjs/blits'

/**
 * Header bar with application title and subtle accent.
 */
export default Blits.Component('Header', {
  template: `
    <Element w="1800" h="80">
      <!-- Background card -->
      <Element w="1800" h="80" :color="$theme.surface" radius="20" />
      <!-- Shadow overlay -->
      <Element w="1800" h="80" :color="$shadow" radius="20" alpha="0.06" />
      <!-- Accent bar -->
      <Element x="0" y="0" w="12" h="80" :color="$theme.primary" radius="20" />

      <Text
        x="36" y="22"
        :content="$title"
        :color="$theme.text"
        fontSize="36"
      />

      <Element x="1640" y="22" w="140" h="36" :color="$badgeBg" radius="12">
        <Text x="16" y="4" content="Ocean Pro" :color="$theme.primary" fontSize="22" />
      </Element>
    </Element>
  `,
  state() {
    const theme = this.$parent?.$theme || {}
    return {
      theme,
      title: 'Simple Notes',
      shadow: 0x000000ff,
      badgeBg: 0xEFF6FFff, // light blue bg
    }
  },
  computed: {
    $theme() { return this.theme },
    $title() { return this.title },
    $shadow() { return this.shadow },
    $badgeBg() { return this.badgeBg },
  },
})
