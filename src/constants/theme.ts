/**
 * Minimal design tokens for a clean, light UI.
 *
 * The app is intentionally single-theme (light) for the MVP — simpler to build
 * and reason about than a full light/dark system. Dark mode is a documented
 * next step. Forced light mode is also set in app.json (`userInterfaceStyle`).
 */

export const colors = {
  background: '#FFFFFF',
  surface: '#F6F7F9',
  surfaceAlt: '#ECEEF2',
  border: '#E4E7EC',

  text: '#15171C',
  textSecondary: '#5B616E',
  textMuted: '#6B7280',

  primary: '#2563EB',
  primaryMuted: '#DBE7FE',
  onPrimary: '#FFFFFF',

  // Result palette — reused anywhere a result is shown (badges, selector, bars).
  attempt: '#475569',
  send: '#15803D',
  flash: '#B45309',

  danger: '#DC2626',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 30,
  display: 40,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;
