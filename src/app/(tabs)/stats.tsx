import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BarRow } from '@/components/bar-row';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { StatTile } from '@/components/stat-tile';
import { colors, fontSize, fontWeight, spacing } from '@/constants/theme';
import { computeStats } from '@/lib/stats';
import { useSessionStore } from '@/store/useSessionStore';

export default function StatsScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const stats = useMemo(() => computeStats(sessions), [sessions]);

  if (stats.totalClimbs === 0) {
    return (
      <Screen edges={[]}>
        <EmptyState
          icon="stats-chart-outline"
          title="No stats yet"
          message="Log some climbs and your progress will show up here."
        />
      </Screen>
    );
  }

  const sendRate = Math.round((stats.totalSends / stats.totalClimbs) * 100);
  const maxSends = Math.max(1, ...stats.sendsByGrade.map((g) => g.count));
  const maxAttempts = Math.max(1, ...stats.attemptsByGrade.map((g) => g.count));

  return (
    <Screen scroll edges={[]}>
      <View style={styles.tiles}>
        <StatTile label="Sessions" value={String(stats.totalSessions)} />
        <StatTile label="Climbs logged" value={String(stats.totalClimbs)} />
        <StatTile label="Total sends" value={String(stats.totalSends)} />
        <StatTile label="Send rate" value={`${sendRate}%`} />
        <StatTile label="Highest send" value={stats.highestSent ?? '—'} />
        <StatTile label="Highest flash" value={stats.highestFlashed ?? '—'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sends by grade</Text>
        {stats.sendsByGrade.map((g) => (
          <BarRow
            key={g.grade}
            label={g.grade}
            count={g.count}
            max={maxSends}
            color={colors.send}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attempts by grade</Text>
        {stats.attemptsByGrade.map((g) => (
          <BarRow
            key={g.grade}
            label={g.grade}
            count={g.count}
            max={maxAttempts}
            color={colors.attempt}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  section: { gap: spacing.sm },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
});
