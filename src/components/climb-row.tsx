import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '@/constants/theme';
import { formatTime } from '@/lib/date';
import type { ClimbLog } from '@/types';

import { GradeBadge } from './grade-badge';
import { ResultBadge } from './result-badge';

interface ClimbRowProps {
  climb: ClimbLog;
  onDelete?: () => void;
}

export function ClimbRow({ climb, onDelete }: ClimbRowProps) {
  return (
    <View style={styles.row}>
      <GradeBadge grade={climb.grade} />
      <View style={styles.middle}>
        <ResultBadge result={climb.result} />
        {climb.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {climb.notes}
          </Text>
        ) : null}
      </View>
      <Text style={styles.time}>{formatTime(climb.createdAt)}</Text>
      {onDelete ? (
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Delete climb"
          style={styles.delete}>
          <Ionicons name="close" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  middle: { flex: 1, gap: spacing.xs },
  notes: { fontSize: fontSize.sm, color: colors.textSecondary },
  time: { fontSize: fontSize.xs, color: colors.textMuted },
  delete: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
