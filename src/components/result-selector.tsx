import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RESULT_META } from '@/constants/results';
import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';
import { CLIMB_RESULTS, type ClimbResult } from '@/types';

interface ResultSelectorProps {
  value: ClimbResult;
  onChange: (result: ClimbResult) => void;
}

export function ResultSelector({ value, onChange }: ResultSelectorProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel="Result">
      {CLIMB_RESULTS.map((result) => {
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
              selected && {
                backgroundColor: meta.selectedBackground,
                borderColor: meta.selectedBackground,
              },
            ]}>
            <Text
              style={[
                styles.label,
                selected
                  ? { color: meta.selectedForeground }
                  : styles.labelDefault,
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
  row: { flexDirection: 'row', gap: spacing.sm },
  segment: {
    flex: 1,
    minHeight: 48,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  label: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  labelDefault: { color: colors.text },
});
