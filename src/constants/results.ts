/**
 * Display metadata for climb results — labels and colors in one place so the
 * badge, selector, and stat bars stay visually consistent.
 *
 * In the sumi-e theme a send is ink, an attempt is wash gray, and a flash is the
 * lone splash of color (the seal red). A flash is rendered as the hanko seal in
 * the climb list, so its `color` is only used where a colored mark is needed.
 */
import type { ClimbResult } from '@/types';
import { colors } from './theme';

interface ResultMeta {
  label: string;
  color: string;
}

export const RESULT_META: Record<ClimbResult, ResultMeta> = {
  attempt: { label: 'Attempt', color: colors.attempt },
  send: { label: 'Send', color: colors.send },
  flash: { label: 'Flash', color: colors.seal },
};
