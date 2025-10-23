import Blits from '@lightningjs/blits'

/**
 * Ocean Professional theme configuration
 * Provides colors, spacing, radii, and reusable style helpers.
 */
const palette = {
  primary: 0xff2563eb,   // Blue-600
  secondary: 0xfff59e0b, // Amber-500
  success: 0xfff59e0b,   // Amber-500 (accent usage)
  error: 0xffef4444,     // Red-500
  background: 0xfff9fafb,// Gray-50
  surface: 0xffffffff,   // White
  text: 0xff111827,      // Gray-900
  textMuted: 0xff6b7280, // Gray-500
  border: 0xffe5e7eb,    // Gray-200
  shadow: 0x22000000     // Translucent shadow
}

export const Theme = {
  name: 'Ocean Professional',
  palette,
  radius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  spacing: (mul = 1) => 8 * mul,
  // PUBLIC_INTERFACE
  createSurface({ w, h, x = 0, y = 0, color = palette.surface, radius = 12, alpha = 1, zIndex = 1 } = {}) {
    /** Create a rounded surface placeholder element. Radius is currently informational. */
    return `<Element x="${x}" y="${y}" w="${w}" h="${h}" :color="${color}" :alpha="${alpha}" zIndex="${zIndex}" />`
  }
}

export const shadows = {
  soft: 0x22000000
}

export default Blits.Plugin('theme', ({ app }) => {
  app.provide('theme', Theme)
})
