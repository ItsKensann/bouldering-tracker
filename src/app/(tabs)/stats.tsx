import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BarRow } from '@/components/bar-row';
import { EmptyState } from '@/components/empty-state';
import { Enso } from '@/components/enso';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { StatTile } from '@/components/stat-tile';
import { TrendLine } from '@/components/trend-line';
import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  spacing,
} from '@/constants/theme';
import { computeSendRateTrend, computeStats } from '@/lib/stats';
import { useSessionStore } from '@/store/useSessionStore';

export default function StatsScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const trend = useMemo(() => computeSendRateTrend(sessions), [sessions]);

  if (stats.totalClimbs === 0) {
    return (
      <Screen edges={['top']}>
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
  // Pyramid reads hardest-on-top.
  const pyramid = [...stats.sendsByGrade].reverse();
  const peakCount =
    stats.sendsByGrade.find((g) => g.grade === stats.highestSent)?.count ?? 0;

  return (
    <Screen scroll edges={['top']}>
      <View style={styles.titleBlock}>
        <Text style={styles.eyebrow}>All time</Text>
        <Text style={styles.title}>Ascent</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatTile label="Sessions" value={String(stats.totalSessions)} />
        <StatTile label="Climbs logged" value={String(stats.totalClimbs)} />
        <StatTile label="Total sends" value={String(stats.totalSends)} />
        <StatTile label="Send rate" value={`${sendRate}%`} />
        <StatTile label="Highest send" value={stats.highestSent ?? '—'} />
        <StatTile label="Highest flash" value={stats.highestFlashed ?? '—'} />
      </View>

      <SectionHeader>Grade pyramid</SectionHeader>
      <View style={styles.pyramid}>
        {pyramid.map((g) => (
          <BarRow
            key={g.grade}
            label={g.grade}
            count={g.count}
            max={maxSends}
            color={colors.send}
          />
        ))}
      </View>

      {stats.highestSent ? (
        <View style={styles.ensoBlock}>
          <Enso grade={stats.highestSent} label="Peak" />
          <View style={styles.ensoInfo}>
            <Text style={styles.ensoEyebrow}>Peak send</Text>
            <Text style={styles.ensoName}>Hardest ascent</Text>
            <Text style={styles.ensoSub}>
              {peakCount} {peakCount === 1 ? 'send' : 'sends'} at{' '}
              {stats.highestSent}
              {stats.highestFlashed
                ? ` · flashed up to ${stats.highestFlashed}`
                : ''}
            </Text>
          </View>
        </View>
      ) : null}

      <SectionHeader>Send rate</SectionHeader>
      <TrendLine data={trend} />

      <SectionHeader>Attempts by grade</SectionHeader>
      <View style={styles.pyramid}>
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
  titleBlock: { gap: spacing.xs },
  eyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.eyebrow,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  title: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.display,
    lineHeight: fontSize.display,
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.xl,
  },
  pyramid: { gap: spacing.sm, marginTop: spacing.sm },
  ensoBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  ensoInfo: { flex: 1, gap: spacing.xs },
  ensoEyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  ensoName: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.lg,
    color: colors.text,
  },
  ensoSub: {
    fontFamily: fontFamily.sansLight,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
