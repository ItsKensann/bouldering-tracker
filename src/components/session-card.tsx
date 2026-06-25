import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { formatDate, formatDuration, formatTime } from '@/lib/date';
import { summarizeSession } from '@/lib/stats';
import type { ClimbingSession } from '@/types';

import { Card } from './card';

interface SessionCardProps {
  session: ClimbingSession;
  onPress: () => void;
}

export function SessionCard({ session, onPress }: SessionCardProps) {
  const { climbCount, sendCount, topGrade, isActive } = summarizeSession(session);
  const accessibilityLabel = [
    formatDate(session.startedAt),
    isActive
      ? 'active session'
      : formatDuration(session.startedAt, session.endedAt),
    `${climbCount} ${climbCount === 1 ? 'climb' : 'climbs'}`,
    `${sendCount} sent`,
    topGrade ? `top grade ${topGrade}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Opens session details">
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(session.startedAt)}</Text>
        {isActive ? (
          <View style={styles.activePill}>
            <Text style={styles.activeText}>Active</Text>
          </View>
        ) : (
          <Text style={styles.duration}>
            {formatDuration(session.startedAt, session.endedAt)}
          </Text>
        )}
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {formatTime(session.startedAt)} · {climbCount}{' '}
          {climbCount === 1 ? 'climb' : 'climbs'} · {sendCount} sent
        </Text>
        {topGrade ? <Text style={styles.topGrade}>Top {topGrade}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.text },
  duration: { fontSize: fontSize.sm, color: colors.textSecondary },
  activePill: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  activeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: { fontSize: fontSize.sm, color: colors.textSecondary, flexShrink: 1 },
  topGrade: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
});
