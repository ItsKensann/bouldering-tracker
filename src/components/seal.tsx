/**
 * The hanko seal — 完登 (kantō, "completed ascent"). The single splash of color
 * in the app, stamped on a flash. Purely decorative; carries an accessibility
 * label so it still reads as "Flash" to screen readers.
 */
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, radius } from '@/constants/theme';

interface SealProps {
  size?: number;
}

export function Seal({ size = 34 }: SealProps) {
  return (
    <View
      style={[styles.seal, { width: size, height: size }]}
      accessibilityRole="image"
      accessibilityLabel="Flash — completed ascent">
      <Text
        allowFontScaling={false}
        style={[styles.text, { fontSize: size * 0.32 }]}>
        完登
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  seal: {
    backgroundColor: colors.seal,
    borderRadius: radius.seal,
    alignItems: 'center',
    justifyContent: 'center',
    // A faint inner keyline, like ink pressed inside the stamp's border.
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    transform: [{ rotate: '-4deg' }],
  },
  text: {
    fontFamily: fontFamily.serifBold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
