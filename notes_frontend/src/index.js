import Blits from '@lightningjs/blits'
import App from './App.js'

/**
 * Entrypoint for the Simple Notes Lightning (Blits) app.
 * Adds basic key mappings and launches the application on the default canvas 'app'.
 */
Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  debugLevel: 1,
  // Basic key mappings for navigation and actions
  keys: {
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    enter: ['Enter', 'NumpadEnter'],
    back: ['Backspace', 'Escape'],
  },
})
