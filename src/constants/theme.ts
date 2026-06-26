/**
 * Design tokens for the "Quiet Send" sumi-e theme.
 *
 * Washi paper is the ground; sumi ink is the accent. The single splash of color
 * is the seal red, used only on flashes. The app stays single-theme (light) for
 * the MVP — forced light mode is also set in app.json (`userInterfaceStyle`).
 *
 * Two Japanese typefaces carry the look (loaded in `src/app/_layout.tsx`):
 * - Shippori Mincho (serif) — display numerals, grades, titles.
 * - Zen Kaku Gothic New (sans) — labels, body, eyebrows.
 *
 * NOTE: with custom fonts, React Native's `fontWeight` is unreliable (especially
 * on Android) — weight comes from the loaded font family. Prefer `fontFamily`
 * for ink/serif text; the `fontWeight` tokens remain only as a system fallback.
 */

export const colors = {
  // Ground — washi paper.
  background: '#FAF8F3', // paper
  surface: '#FDFCF8', // paper, one step brighter
  surfaceAlt: '#EFECE4', // paper edge — track fills, faint chips
  border: '#E3DFD5', // solid hairline equivalent

  // Hairlines (translucent ink) — for dividers and rules.
  hairline: 'rgba(27,26,23,0.10)',
  hairline2: 'rgba(27,26,23,0.18)',

  // Ink + wash text scale.
  text: '#1B1A17', // sumi
  textSecondary: '#403D37', // sumi soft
  textMuted: '#9B968C', // wash
  wash2: '#B8B3A8',
  washLight: '#D8D4CA',

  // "primary" is now the ink — the active/selected color. This single remap
  // reskins the CTA, selected chips/segments, badges, and active tab tint.
  primary: '#1B1A17',
  primaryMuted: 'rgba(27,26,23,0.06)',
  onPrimary: '#FAF8F3', // paper, for text on ink

  // Result palette — reused anywhere a result is shown (badges, selector, bars).
  // A flash is the lone splash of color (the seal); a send is ink; an attempt
  // is wash gray.
  attempt: '#9B968C', // wash
  send: '#1B1A17', // ink
  flash: '#B0472F', // seal red

  // The single accent — the hanko seal.
  seal: '#B0472F',

  danger: '#9E3B27',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Squared-off radii — the sumi-e layout is flat and hairline-ruled. */
export const radius = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 6,
  seal: 5,
  pill: 999,
} as const;

export const fontSize = {
  // Uppercase letter-spaced eyebrows, stat labels, tags.
  eyebrow: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 30,
  display: 40,
  // Large serif numerals — stat values and grade heroes.
  grade: 28,
  display2: 48,
  hero: 96,
  mega: 150,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Font families. Values match the keys loaded via `useFonts` in `_layout.tsx`
 * (the @expo-google-fonts module export names register under these exact names).
 */
export const fontFamily = {
  serif: 'ShipporiMincho_600SemiBold',
  serifBold: 'ShipporiMincho_700Bold',
  sans: 'ZenKakuGothicNew_400Regular',
  sansLight: 'ZenKakuGothicNew_300Light',
  sansMedium: 'ZenKakuGothicNew_500Medium',
} as const;

/** Tracking, in px (React Native `letterSpacing` is absolute, not em-relative). */
export const letterSpacing = {
  wide: 1,
  wider: 2,
  eyebrow: 2.2,
} as const;
