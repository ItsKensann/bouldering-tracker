import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RESULT_META } from '@/constants/results';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';
import { CLIMB_RESULTS, type ClimbResult } from '@/types';

interface ResultSelectorProps {
  value: ClimbResult;
  onChange: (result: ClimbResult) => void;
}

export function ResultSelector({ value, onChange }: ResultSelectorProps) {
  return (
    <View
      style={styles.group}
      accessibilityRole="radiogroup"
      accessibilityLabel="Result">
      {CLIMB_RESULTS.map((result, index) => {
        const selected = result === value;
        const meta = RESULT_META[result];
        return (
          <Pressable
            key={result}
            onPress={() => onChange(result)}
            accessibilityRole="radio"
            accessibilityLabel={meta.label}
            accessibilityState={{ selected }}
            style={[
              styles.segment,
              index > 0 && styles.divider,
              selected && styles.segmentSelected,
            ]}>
            <Text
              style={[
                styles.label,
                selected ? styles.labelSelected : styles.labelDefault,
              ]}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.hairline2,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    minHeight: 48,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  divider: { borderLeftWidth: 1, borderLeftColor: colors.hairline },
  segmentSelected: { backgroundColor: colors.primary },
  label: { fontFamily: fontFamily.serif, fontSize: fontSize.md },
  labelDefault: { color: colors.textMuted },
  labelSelected: { color: colors.onPrimary },
});
