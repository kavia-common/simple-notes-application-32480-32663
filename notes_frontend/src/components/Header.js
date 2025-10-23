import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'

export default Blits.Component('Header', {
  state() {
    return {
      title: 'Retro Notes',
      subtitle: 'Ocean Professional'
    }
  },
  template: `
    <Element x="0" y="0" w="$w" h="88" :color="${Theme.palette.surface}" zIndex="5">
      <Element x="0" y="0" w="$w" h="88" :color="${Theme.palette.surface}" />
      <Element x="0" y="86" w="$w" h="2" :color="${Theme.palette.border}" alpha="0.8" />
      <Text x="40" y="26" :content="$title" :fontSize="36" :textColor="${Theme.palette.primary}" />
      <Text x="40" y="60" :content="$subtitle" :fontSize="18" :textColor="${Theme.palette.textMuted}" alpha="0.9" />
      <Element x="$w - 220" y="26" w="180" h="40" :color="${Theme.palette.primary}" :alpha="0.08" />
      <Text x="$w - 205" y="36" content="v1.0" :fontSize="20" :textColor="${Theme.palette.primary}" />
    </Element>
  `
})
