import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrushRule } from '@/components/brush-rule';
import { Button } from '@/components/button';
import { HomeAction } from '@/components/home-action';
import { Screen } from '@/components/screen';
import { SectionHeader } from '@/components/section-header';
import { SessionCard } from '@/components/session-card';
import { StatTile } from '@/components/stat-tile';
import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  spacing,
} from '@/constants/theme';
import { useNow } from '@/hooks/use-now';
import { confirmDestructiveAction } from '@/lib/confirm';
import { formatClockDuration, formatDate } from '@/lib/date';
import { computeStats, computeWeekStreak, summarizeSession } from '@/lib/stats';
import { buildSampleSessions } from '@/mock/sampleData';
import { selectActiveSession, useSessionStore } from '@/store/useSessionStore';

export default function HomeScreen() {
  const router = useRouter();
  const sessions = useSessionStore((s) => s.sessions);
  const activeSession = useSessionStore(selectActiveSession);
  const startSession = useSessionStore((s) => s.startSession);
  const importSessions = useSessionStore((s) => s.importSessions);
  const clearAll = useSessionStore((s) => s.clearAll);
  const now = useNow(!!activeSession);

  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const streak = useMemo(() => computeWeekStreak(sessions), [sessions]);
  const activeSummary = useMemo(
    () => (activeSession ? summarizeSession(activeSession) : null),
    [activeSession],
  );
  const activeElapsed = activeSession
    ? formatClockDuration(activeSession.startedAt, now)
    : '';
  // Sessions are stored newest-first, so the first ended one is the most recent.
  const lastCompleted = useMemo(() => sessions.find((s) => s.endedAt), [sessions]);
  const hasSessions = stats.totalSessions > 0;

  const todayEyebrow = useMemo(
    () => formatDate(new Date().toISOString()).toUpperCase(),
    [],
  );

  const openSession = (id: string) =>
    router.push({ pathname: '/session/[id]', params: { id } });

  const handleStart = () => {
    if (activeSession) {
      openSession(activeSession.id);
      return;
    }
    openSession(startSession());
  };

  const handleClear = () =>
    confirmDestructiveAction({
      title: 'Clear all data?',
      message: 'This deletes every session and climb.',
      confirmLabel: 'Clear',
      onConfirm: clearAll,
    });

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.watermark} pointerEvents="none">
          <Text style={styles.watermarkChar}>登</Text>
          <Text style={styles.watermarkChar}>山</Text>
        </View>
        <Text style={styles.brand}>墨</Text>
        <Text style={styles.eyebrow}>{todayEyebrow}</Text>
        <Text style={styles.title}>Bouldering</Text>
        {streak >= 1 ? (
          <Text style={styles.streak}>
            {streak}-week streak{streak >= 2 ? ' · keep it going' : ''}
          </Text>
        ) : null}
        <BrushRule style={styles.heroRule} />
      </View>

      <HomeAction
        isActive={!!activeSession}
        elapsed={activeElapsed}
        climbCount={activeSummary?.climbCount}
        sendCount={activeSummary?.sendCount}
        onPress={handleStart}
      />

      {hasSessions ? (
        <>
          <View>
            <SectionHeader>All time</SectionHeader>
            <View style={styles.statsGrid}>
              <StatTile
                label="Sessions"
                value={String(stats.totalSessions)}
                style={styles.statCol}
              />
              <StatTile
                label="Climbs"
                value={String(stats.totalClimbs)}
                style={styles.statCol}
              />
              <StatTile
                label="Highest send"
                value={stats.highestSent ?? '—'}
                style={styles.statCol}
              />
            </View>
          </View>

          {lastCompleted ? (
            <View>
              <SectionHeader>Recent</SectionHeader>
              <SessionCard
                session={lastCompleted}
                onPress={() => openSession(lastCompleted.id)}
              />
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.firstRun}>
          Start a session to begin tracking — your climbs and stats appear here.
        </Text>
      )}

      {__DEV__ ? (
        <View style={styles.devTools}>
          <SectionHeader>Developer tools</SectionHeader>
          <Button
            label="Load sample data"
            variant="secondary"
            onPress={() => importSessions(buildSampleSessions())}
          />
          <Button label="Clear all data" variant="danger" onPress={handleClear} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl },
  hero: { position: 'relative', paddingTop: spacing.sm, gap: spacing.xs },
  watermark: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
  },
  watermarkChar: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.display,
    lineHeight: fontSize.display,
    color: colors.washLight,
  },
  brand: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize.display2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  eyebrow: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.eyebrow,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  title: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.display2,
    lineHeight: fontSize.display2,
    color: colors.text,
  },
  streak: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    letterSpacing: letterSpacing.wide,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  heroRule: { marginTop: spacing.md },
  statsGrid: {
    flexDirection: 'row',
    columnGap: spacing.lg,
  },
  statCol: { flexBasis: 0, flexGrow: 1 },
  firstRun: {
    fontFamily: fontFamily.sansLight,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 26,
    paddingVertical: spacing.sm,
  },
  devTools: { gap: spacing.sm },
});
