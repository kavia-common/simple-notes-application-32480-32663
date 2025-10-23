import Blits from '@lightningjs/blits'
import Home from './pages/Home.js'

/**
 * Root Application for the Simple Notes app.
 * Renders RouterView and provides global app-level metadata/theme.
 */
export default Blits.Application({
  template: `
    <Element :color="$theme.background" w="1920" h="1080">
      <RouterView />
    </Element>
  `,
  // Define routes (single page for this app)
  routes: [
    { path: '/', component: Home, options: { title: 'Notes' } },
  ],
  state() {
    // Ocean Professional palette exposed for children
    return {
      theme: {
        name: 'Ocean Professional',
        primary: 0x2563EBff,     // Blue-600
        secondary: 0xF59E0Bff,   // Amber-500
        error: 0xEF4444ff,       // Red-500
        background: 0xF9FAFBff,  // Gray-50
        surface: 0xFFFFFFFF,     // White
        text: 0x111827ff,        // Gray-900
        shadow: 0x00000033,      // subtle shadow
      },
    }
  },
  computed: {
    $theme() { return this.theme },
  },
})
