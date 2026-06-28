import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
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
import { formatDate, formatDuration } from '@/lib/date';
import { confirmDestructiveAction } from '@/lib/confirm';
import { computeStats, summarizeSession } from '@/lib/stats';
import { buildSampleSessions } from '@/mock/sampleData';
import { selectActiveSession, useSessionStore } from '@/store/useSessionStore';

export default function HomeScreen() {
  const router = useRouter();
  const sessions = useSessionStore((s) => s.sessions);
  const activeSession = useSessionStore(selectActiveSession);
  const startSession = useSessionStore((s) => s.startSession);
  const importSessions = useSessionStore((s) => s.importSessions);
  const clearAll = useSessionStore((s) => s.clearAll);

  const stats = useMemo(() => computeStats(sessions), [sessions]);
  // Sessions are stored newest-first, so the first ended one is the most recent.
  const lastCompleted = useMemo(() => sessions.find((s) => s.endedAt), [sessions]);

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
    <Screen scroll>
      <View style={styles.hero}>
        <Text style={styles.brand}>墨</Text>
        <Text style={styles.eyebrow}>{todayEyebrow}</Text>
        <Text style={styles.title}>Bouldering</Text>
      </View>

      {activeSession ? (
        <Card style={styles.activeCard}>
          <Text style={styles.activeLabel}>Session in progress</Text>
          <Text style={styles.activeMeta}>
            {summarizeSession(activeSession).climbCount} climbs ·{' '}
            {formatDuration(activeSession.startedAt)}
          </Text>
          <Button
            label="Resume session"
            glyph="登"
            onPress={handleStart}
            style={styles.resumeBtn}
          />
        </Card>
      ) : (
        <Button
          label="Start session"
          glyph="登"
          size="lg"
          onPress={handleStart}
        />
      )}

      <View style={styles.statsGrid}>
        <StatTile label="Sessions" value={String(stats.totalSessions)} />
        <StatTile label="Climbs logged" value={String(stats.totalClimbs)} />
        <StatTile label="Highest send" value={stats.highestSent ?? '—'} />
        <StatTile label="Highest flash" value={stats.highestFlashed ?? '—'} />
      </View>

      <View>
        <SectionHeader>Recent session</SectionHeader>
        {lastCompleted ? (
          <SessionCard
            session={lastCompleted}
            onPress={() => openSession(lastCompleted.id)}
          />
        ) : (
          <Text style={styles.placeholder}>
            No completed sessions yet. Start one above to begin tracking.
          </Text>
        )}
      </View>

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
  hero: { gap: spacing.xs },
  brand: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize.xxl,
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
    fontSize: fontSize.display,
    lineHeight: fontSize.display,
    color: colors.text,
  },
  activeCard: { gap: spacing.sm },
  activeLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.eyebrow,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  activeMeta: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.lg,
    color: colors.text,
  },
  resumeBtn: { marginTop: spacing.sm },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.xl,
    rowGap: 0,
  },
  placeholder: {
    fontFamily: fontFamily.sansLight,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingVertical: spacing.sm,
  },
  devTools: { gap: spacing.sm },
});
