import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize } from '@/constants/theme';
import type { Grade } from '@/types';

interface GradeBadgeProps {
  grade: Grade;
  size?: 'sm' | 'md';
  /** Render in wash gray (e.g. an unsent attempt) rather than full ink. */
  muted?: boolean;
}

export function GradeBadge({ grade, size = 'md', muted = false }: GradeBadgeProps) {
  return (
    <View style={[styles.slot, size === 'sm' && styles.slotSm]}>
      <Text
        style={[
          styles.text,
          size === 'sm' && styles.textSm,
          muted && styles.muted,
        ]}>
        {grade}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { width: 52, justifyContent: 'center' },
  slotSm: { width: 40 },
  text: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.grade,
    lineHeight: fontSize.grade,
    color: colors.text,
  },
  textSm: { fontSize: fontSize.xl, lineHeight: fontSize.xl },
  muted: { color: colors.textMuted },
});
