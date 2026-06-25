import { StyleSheet, Text, View } from 'react-native';

import { RESULT_META } from '@/constants/results';
import { fontSize, fontWeight, spacing } from '@/constants/theme';
import type { ClimbResult } from '@/types';

export function ResultBadge({ result }: { result: ClimbResult }) {
  const meta = RESULT_META[result];
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
});
