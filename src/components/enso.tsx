/**
 * The ensō — a hand-drawn open ring, the zen symbol of completion. Frames the
 * peak send. Drawn as a single near-closed arc (open, never a perfect circle).
 */
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
} from '@/constants/theme';

interface EnsoProps {
  /** Grade shown in the centre, e.g. "V7". */
  grade: string;
  label?: string;
  size?: number;
}

export function Enso({ grade, label = 'Peak', size = 108 }: EnsoProps) {
  return (
    <View
      style={[styles.wrap, { width: size, height: size }]}
      accessibilityRole="image"
      accessibilityLabel={`${label} send ${grade}`}>
      <Svg width={size} height={size} viewBox="0 0 108 108">
        <Path
          d="M54 14 A40 40 0 1 1 38 17"
          stroke={colors.text}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.grade} allowFontScaling={false}>
          {grade}
        </Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grade: {
    fontFamily: fontFamily.serifBold,
    fontSize: fontSize.display2,
    color: colors.text,
    lineHeight: fontSize.display2,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.eyebrow,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginTop: 2,
  },
});
