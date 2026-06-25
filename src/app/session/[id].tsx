import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import { useLayoutEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ClimbRow } from '@/components/climb-row';
import { EmptyState } from '@/components/empty-state';
import { GradeSelector } from '@/components/grade-selector';
import { ResultSelector } from '@/components/result-selector';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { formatDate, formatDuration, formatTime } from '@/lib/date';
import { summarizeSession } from '@/lib/stats';
import { useSessionStore } from '@/store/useSessionStore';
import type { ClimbResult, Grade } from '@/types';

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const session = useSessionStore(
    (state) => state.sessions.find((item) => item.id === id) ?? null,
  );
  const addClimb = useSessionStore((state) => state.addClimb);
  const removeClimb = useSessionStore((state) => state.removeClimb);
  const endSession = useSessionStore((state) => state.endSession);
  const deleteSession = useSessionStore((state) => state.deleteSession);

  // Selections persist between adds to keep repeated logging fast.
  const [grade, setGrade] = useState<Grade>('V0');
  const [result, setResult] = useState<ClimbResult>('send');
  const [notes, setNotes] = useState('');
  const [notesExpanded, setNotesExpanded] = useState(false);

  const isActive = !!session && !session.endedAt;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: session
        ? isActive
          ? 'Active session'
          : formatDate(session.startedAt)
        : 'Session',
    });
  }, [navigation, session, isActive]);

  const climbsNewestFirst = useMemo(
    () => (session ? [...session.climbs].reverse() : []),
    [session],
  );

  if (!session) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <EmptyState
          icon="alert-circle-outline"
          title="Session not found"
          message="It may have been deleted."
          action={<Button label="Go back" onPress={() => router.back()} />}
        />
      </SafeAreaView>
    );
  }

  const summary = summarizeSession(session);

  const handleAdd = () => {
    addClimb(session.id, { grade, result, notes });
    setNotes('');
    setNotesExpanded(false);
    Keyboard.dismiss();
  };

  const handleEnd = () =>
    Alert.alert('End session?', 'You can still view it in History afterward.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End session', onPress: () => endSession(session.id) },
    ]);

  const handleDelete = () =>
    Alert.alert(
      'Delete session?',
      'This permanently removes the session and its climbs.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSession(session.id);
            router.back();
          },
        },
      ],
    );

  const toggleNotes = () => {
    if (notesExpanded) {
      setNotes('');
      Keyboard.dismiss();
    }
    setNotesExpanded((expanded) => !expanded);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          style={styles.flex}
          data={climbsNewestFirst}
          keyExtractor={(climb) => climb.id}
          renderItem={({ item }) => (
            <ClimbRow
              climb={item}
              onDelete={
                isActive
                  ? () => removeClimb(session.id, item.id)
                  : undefined
              }
            />
          )}
          ListHeaderComponent={
            <View style={styles.summary}>
              <Text style={styles.summaryTime}>
                {formatTime(session.startedAt)} ·{' '}
                {formatDuration(session.startedAt, session.endedAt)}
                {isActive ? ' · in progress' : ''}
              </Text>
              <Text style={styles.summaryStats}>
                {summary.climbCount}{' '}
                {summary.climbCount === 1 ? 'climb' : 'climbs'} ·{' '}
                {summary.sendCount} sent
                {summary.topGrade ? ` · top ${summary.topGrade}` : ''}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isActive
                ? 'No climbs logged yet. Add your first below.'
                : 'No climbs were logged.'}
            </Text>
          }
          ListFooterComponent={
            !isActive ? (
              <Button
                label="Delete session"
                variant="danger"
                onPress={handleDelete}
                style={styles.deleteButton}
              />
            ) : null
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />

        {isActive ? (
          <View style={styles.panel}>
            <Text style={styles.panelLabel}>Grade</Text>
            <GradeSelector value={grade} onChange={setGrade} />

            <Text style={styles.panelLabel}>Result</Text>
            <ResultSelector value={result} onChange={setResult} />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={notesExpanded ? 'Remove note' : 'Add a note'}
              accessibilityState={{ expanded: notesExpanded }}
              onPress={toggleNotes}
              style={({ pressed }) => [
                styles.notesToggle,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.notesToggleText}>
                {notesExpanded ? 'Remove note' : '+ Add note (optional)'}
              </Text>
            </Pressable>

            {notesExpanded ? (
              <TextInput
                autoFocus
                accessibilityLabel="Climb notes"
                style={styles.notes}
                placeholder="Add a short note"
                placeholderTextColor={colors.textMuted}
                value={notes}
                onChangeText={setNotes}
                maxLength={240}
                multiline
                textAlignVertical="top"
              />
            ) : null}

            <View style={styles.panelActions}>
              <Button
                label="End session"
                variant="secondary"
                onPress={handleEnd}
                style={styles.endButton}
              />
              <Button
                label="Add climb"
                onPress={handleAdd}
                accessibilityHint={`Logs a ${grade} ${result}`}
                style={styles.addButton}
              />
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  summary: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryTime: { fontSize: fontSize.sm, color: colors.textSecondary },
  summaryStats: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  empty: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
  },
  deleteButton: { marginTop: spacing.xl },
  panel: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  panelLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  notesToggle: {
    minHeight: 44,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  notesToggleText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  notes: {
    minHeight: 64,
    maxHeight: 96,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  panelActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  endButton: { flex: 1 },
  addButton: { flex: 1.4 },
  pressed: { opacity: 0.7 },
});
