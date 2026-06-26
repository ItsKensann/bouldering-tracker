import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { SessionCard } from '@/components/session-card';
import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  spacing,
} from '@/constants/theme';
import { useSessionStore } from '@/store/useSessionStore';

export default function HistoryScreen() {
  const router = useRouter();
  const sessions = useSessionStore((s) => s.sessions);
  const startSession = useSessionStore((s) => s.startSession);

  const ordered = useMemo(
    () => [...sessions].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
    [sessions],
  );

  const openSession = (id: string) =>
    router.push({ pathname: '/session/[id]', params: { id } });

  if (ordered.length === 0) {
    return (
      <Screen edges={['top']}>
        <EmptyState
          icon="calendar-outline"
          title="No sessions yet"
          message="Start your first climbing session to see it here."
          action={
            <Button
              label="Start session"
              glyph="登"
              onPress={() => openSession(startSession())}
            />
          }
        />
      </Screen>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={ordered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard session={item} onPress={() => openSession(item.id)} />
        )}
        ListHeaderComponent={
          <View style={styles.titleBlock}>
            <Text style={styles.eyebrow}>
              {ordered.length} {ordered.length === 1 ? 'session' : 'sessions'}
            </Text>
            <Text style={styles.title}>History</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sep: { height: 1, backgroundColor: colors.hairline },
  titleBlock: { gap: spacing.xs, marginBottom: spacing.sm },
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
});
