/**
 * Display metadata for climb results — labels and colors in one place so the
 * badge, selector, and stat bars all stay visually consistent.
 */
import type { ClimbResult } from '@/types';
import { colors } from './theme';

interface ResultMeta {
  label: string;
  color: string;
  selectedBackground: string;
  selectedForeground: string;
}

export const RESULT_META: Record<ClimbResult, ResultMeta> = {
  attempt: {
    label: 'Attempt',
    color: colors.attempt,
    selectedBackground: colors.attempt,
    selectedForeground: colors.onPrimary,
  },
  send: {
    label: 'Send',
    color: colors.send,
    selectedBackground: colors.send,
    selectedForeground: colors.onPrimary,
  },
  flash: {
    label: 'Flash',
    color: colors.flash,
    selectedBackground: colors.flash,
    selectedForeground: colors.onPrimary,
  },
};
