import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';
import { GRADES, type Grade } from '@/types';

interface GradeSelectorProps {
  value: Grade;
  onChange: (grade: Grade) => void;
}

export function GradeSelector({ value, onChange }: GradeSelectorProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel="Grade">
      {GRADES.map((grade) => {
        const selected = grade === value;
        return (
          <Pressable
            key={grade}
            onPress={() => onChange(grade)}
            accessibilityRole="radio"
            accessibilityLabel={grade}
            accessibilityState={{ selected }}
            style={[styles.chip, selected && styles.chipSelected]}>
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {grade}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexGrow: 1,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.xs,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.hairline,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  chipTextSelected: { color: colors.onPrimary },
});
