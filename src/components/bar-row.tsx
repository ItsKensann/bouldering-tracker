import { StyleSheet, Text, View, type DimensionValue } from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';

interface BarRowProps {
  label: string;
  count: number;
  max: number;
  color?: string;
}

export function BarRow({ label, count, max, color = colors.primary }: BarRowProps) {
  const ratio = max > 0 ? count / max : 0;
  // A non-zero count always shows at least a small sliver so it's visible.
  const widthPct = count > 0 ? Math.max(ratio * 100, 8) : 0;
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        {widthPct > 0 ? (
          <View
            style={[
              styles.fill,
              { width: `${widthPct}%` as DimensionValue, backgroundColor: color },
            ]}
          />
        ) : null}
      </View>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  label: {
    width: 36,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  track: {
    flex: 1,
    height: 12,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.pill },
  count: {
    width: 24,
    textAlign: 'right',
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
