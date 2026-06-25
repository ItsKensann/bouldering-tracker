import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { SessionCard } from '@/components/session-card';
import { colors, spacing } from '@/constants/theme';
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
      <Screen edges={[]}>
        <EmptyState
          icon="calendar-outline"
          title="No sessions yet"
          message="Start your first climbing session to see it here."
          action={
            <Button
              label="Start session"
              onPress={() => openSession(startSession())}
            />
          }
        />
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ordered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SessionCard session={item} onPress={() => openSession(item.id)} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  sep: { height: spacing.md },
});
