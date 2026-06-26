import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  radius,
  spacing,
} from '@/constants/theme';
import { formatDate, formatDuration, formatTime } from '@/lib/date';
import { summarizeSession } from '@/lib/stats';
import type { ClimbingSession } from '@/types';

interface SessionCardProps {
  session: ClimbingSession;
  onPress: () => void;
}

export function SessionCard({ session, onPress }: SessionCardProps) {
  const { climbCount, sendCount, topGrade, isActive } = summarizeSession(session);

  const meta = [
    formatTime(session.startedAt),
    isActive ? 'in progress' : formatDuration(session.startedAt, session.endedAt),
    `${climbCount} ${climbCount === 1 ? 'climb' : 'climbs'}`,
    `${sendCount} sent`,
  ].join(' · ');

  const accessibilityLabel = [
    formatDate(session.startedAt),
    isActive ? 'active session' : null,
    meta,
    topGrade ? `top grade ${topGrade}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Opens session details"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.head}>
        <Text style={styles.date}>{formatDate(session.startedAt)}</Text>
        {isActive ? (
          <View style={styles.activePill}>
            <Text style={styles.activeText}>Active</Text>
          </View>
        ) : topGrade ? (
          <Text style={styles.topGrade}>{topGrade}</Text>
        ) : null}
      </View>
      <Text style={styles.meta}>{meta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md, gap: spacing.xs },
  pressed: { opacity: 0.6 },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  date: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.lg,
    color: colors.text,
  },
  topGrade: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  activePill: {
    borderWidth: 1,
    borderColor: colors.hairline2,
    borderRadius: radius.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  activeText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  meta: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
