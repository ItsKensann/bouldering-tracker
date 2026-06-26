import { StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  spacing,
} from '@/constants/theme';

interface StatTileProps {
  label: string;
  value: string;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexGrow: 1,
    flexBasis: '46%',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  value: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.display,
    lineHeight: fontSize.display,
    color: colors.text,
  },
});
