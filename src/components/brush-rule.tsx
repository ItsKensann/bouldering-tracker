/**
 * A horizontal rule with an optional ink-brush texture. When a brush-stroke asset
 * is supplied it's tinted to ink and drawn full width; otherwise it falls back to
 * the standard quiet hairline — so the layout never regresses to a bad procedural
 * brush while the texture asset is being sourced/verified on-device.
 *
 * Pass a brush PNG via `source` (transparent background, dark stroke), e.g.
 *   <BrushRule source={require('../../assets/images/brush-rule.png')} />
 */
import { Image, type ImageSource } from 'expo-image';
import {
  StyleSheet,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/constants/theme';

interface BrushRuleProps {
  /** Brush-stroke image. Omit to render the plain hairline fallback. */
  source?: ImageSource | number;
  /** Drawn height of the brush stroke (ignored by the hairline fallback). */
  height?: number;
  /** Ink color the stroke is tinted to. */
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function BrushRule({
  source,
  height = 14,
  color = colors.text,
  style,
}: BrushRuleProps) {
  if (!source) {
    return <View style={[styles.hairline, style]} accessibilityElementsHidden />;
  }

  return (
    <Image
      source={source}
      tintColor={color}
      contentFit="contain"
      style={[{ height }, styles.brush, style] as StyleProp<ImageStyle>}
      accessibilityElementsHidden
    />
  );
}

const styles = StyleSheet.create({
  hairline: {
    height: 1,
    width: '100%',
    backgroundColor: colors.hairline,
  },
  brush: {
    width: '100%',
  },
});
