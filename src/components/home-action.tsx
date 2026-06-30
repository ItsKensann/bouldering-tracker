/**
 * The Home page's single centerpiece action. Idle, it's a bold ink block that
 * starts a session; while a session is live it becomes a tall banner showing the
 * ticking clock and a quick tally, tapping anywhere to resume. One press target,
 * so starting/continuing a session is always the obvious thing to do.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  radius,
  spacing,
} from '@/constants/theme';

interface HomeActionProps {
  isActive: boolean;
  /** Live elapsed clock for the active session, e.g. "08:42". */
  elapsed?: string;
  climbCount?: number;
  sendCount?: number;
  onPress: () => void;
}

export function HomeAction({
  isActive,
  elapsed = '',
  climbCount = 0,
  sendCount = 0,
  onPress,
}: HomeActionProps) {
  const meta = `${climbCount} ${climbCount === 1 ? 'climb' : 'climbs'} · ${sendCount} sent`;

  if (isActive) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Session in progress, ${elapsed}, ${meta}`}
        accessibilityHint="Resumes the active session"
        onPress={onPress}
        style={({ pressed }) => [styles.banner, pressed && styles.pressed]}>
        <View style={styles.bannerHead}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={styles.eyebrow}>Session in progress</Text>
          </View>
          <Text style={styles.glyph}>登</Text>
        </View>
        <Text style={styles.clock} allowFontScaling={false}>
          {elapsed}
        </Text>
        <Text style={styles.meta}>{meta}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Start session"
      accessibilityHint="Starts a new climbing session"
      onPress={onPress}
      style={({ pressed }) => [styles.start, pressed && styles.pressed]}>
      <Text style={styles.startLabel}>Start session</Text>
      <Text style={styles.glyph}>登</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },

  // Idle — the bold ink CTA block.
  start: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  startLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
    color: colors.onPrimary,
  },

  // Active — the live session banner.
  banner: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  bannerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.seal,
  },
  eyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.eyebrow,
    textTransform: 'uppercase',
    color: colors.onPrimaryMuted,
  },
  clock: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.display,
    lineHeight: fontSize.display,
    color: colors.onPrimary,
  },
  meta: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    color: colors.onPrimaryMuted,
  },
  glyph: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.xl,
    color: colors.onPrimary,
  },
});
