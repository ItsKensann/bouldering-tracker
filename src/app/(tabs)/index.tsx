import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { SessionCard } from '@/components/session-card';
import { StatTile } from '@/components/stat-tile';
import { colors, fontSize, fontWeight, spacing } from '@/constants/theme';
import { formatDuration } from '@/lib/date';
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
    Alert.alert('Clear all data?', 'This deletes every session and climb.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clearAll() },
    ]);

  return (
    <Screen scroll>
      <View style={styles.hero}>
        <Text style={styles.title}>Bouldering</Text>
        <Text style={styles.subtitle}>Log a session, track your progress.</Text>
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
            onPress={handleStart}
            style={styles.resumeBtn}
          />
        </Card>
      ) : (
        <Button label="Start session" size="lg" onPress={handleStart} />
      )}

      <View style={styles.statsRow}>
        <StatTile label="Sessions" value={String(stats.totalSessions)} />
        <StatTile label="Climbs logged" value={String(stats.totalClimbs)} />
        <StatTile label="Highest send" value={stats.highestSent ?? '—'} />
        <StatTile label="Highest flash" value={stats.highestFlashed ?? '—'} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent session</Text>
        {lastCompleted ? (
          <SessionCard
            session={lastCompleted}
            onPress={() => openSession(lastCompleted.id)}
          />
        ) : (
          <Card>
            <Text style={styles.placeholder}>
              No completed sessions yet. Start one above to begin tracking.
            </Text>
          </Card>
        )}
      </View>

      {__DEV__ ? (
        <View style={styles.devTools}>
          <Text style={styles.devLabel}>Developer tools</Text>
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary },
  activeCard: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
    gap: spacing.xs,
  },
  activeLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  activeMeta: { fontSize: fontSize.sm, color: colors.textSecondary },
  resumeBtn: { marginTop: spacing.md },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  section: { gap: spacing.md },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  placeholder: { fontSize: fontSize.sm, color: colors.textSecondary },
  devTools: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  devLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
