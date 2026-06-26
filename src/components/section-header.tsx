/**
 * Uppercase, letter-spaced section label with a trailing hairline rule — the
 * quiet divider used between sections across the app.
 */
import { StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  spacing,
} from '@/constants/theme';

interface SectionHeaderProps {
  children: string;
  /** Tighten the top margin when the header sits near other content. */
  compact?: boolean;
}

export function SectionHeader({ children, compact = false }: SectionHeaderProps) {
  return (
    <View style={[styles.row, compact && styles.compact]}>
      <Text style={styles.label} accessibilityRole="header">
        {children}
      </Text>
      <View style={styles.rule} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  compact: { marginTop: spacing.sm },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.eyebrow,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  rule: { flex: 1, height: 1, backgroundColor: colors.hairline },
});
