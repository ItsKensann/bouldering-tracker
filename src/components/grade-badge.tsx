import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import type { Grade } from '@/types';

interface GradeBadgeProps {
  grade: Grade;
  size?: 'sm' | 'md';
}

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  return (
    <View style={[styles.badge, size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, size === 'md' && styles.textMd]}>{grade}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
  },
  badgeMd: { minWidth: 44, paddingVertical: spacing.sm },
  text: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
  },
  textMd: { fontSize: fontSize.md },
});
