import { StyleSheet, Text, View } from 'react-native';

import { RESULT_META } from '@/constants/results';
import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  radius,
  spacing,
} from '@/constants/theme';
import type { ClimbResult } from '@/types';

import { Seal } from './seal';

export function ResultBadge({ result }: { result: ClimbResult }) {
  // A flash is stamped with the hanko seal — the one note of color.
  if (result === 'flash') {
    return <Seal size={32} />;
  }

  const meta = RESULT_META[result];
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderWidth: 1,
    borderColor: colors.hairline2,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tagText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
});
