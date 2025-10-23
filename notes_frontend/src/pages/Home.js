import Blits from '@lightningjs/blits'
import { Theme } from '../theme.js'

export default Blits.Component('Home', {
  template: `
    <Element>
      <Element x="0" y="$h - 36" w="$w" h="36" :color="${Theme.palette.background}">
        <Text x="24" y="8" content="Welcome to Retro Notes" :fontSize="18" :textColor="${Theme.palette.textMuted}" />
      </Element>
    </Element>
  `
})
