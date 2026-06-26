import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, letterSpacing, spacing } from '@/constants/theme';
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
      <GradeBadge grade={climb.grade} muted={climb.result === 'attempt'} />
      <View style={styles.middle}>
        {climb.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            {climb.notes}
          </Text>
        ) : null}
        <Text style={styles.time}>{formatTime(climb.createdAt)}</Text>
      </View>
      <ResultBadge result={climb.result} />
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  middle: { flex: 1, gap: spacing.xs },
  notes: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  time: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.wide,
    color: colors.textMuted,
  },
  delete: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
