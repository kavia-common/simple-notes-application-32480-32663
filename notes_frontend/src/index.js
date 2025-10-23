import App from './App.js'
import Blits from '@lightningjs/blits'

// Launch app with key mappings
Blits.Launch(App, 'app', {
  w: 1280,
  h: 720,
  keys: {
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    enter: ['Enter'],
    back: ['Escape']
  }
})
