import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type AccessibilityState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {
  colors,
  fontFamily,
  fontSize,
  letterSpacing,
  radius,
  spacing,
} from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional serif kanji rendered after the label (e.g. 登 on the log CTA). */
  glyph?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  style?: StyleProp<ViewStyle>;
}

const VARIANT_STYLES: Record<
  ButtonVariant,
  { bg: string; fg: string; border?: string }
> = {
  primary: { bg: colors.primary, fg: colors.onPrimary },
  secondary: { bg: 'transparent', fg: colors.text, border: colors.hairline2 },
  ghost: { bg: 'transparent', fg: colors.text },
  danger: { bg: 'transparent', fg: colors.danger, border: colors.hairline2 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  glyph,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  style,
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ ...accessibilityState, disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' && styles.large,
        { backgroundColor: v.bg },
        v.border ? { borderWidth: 1, borderColor: v.border } : null,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <View style={styles.inner}>
        <Text
          style={[
            styles.label,
            size === 'lg' && styles.labelLarge,
            { color: v.fg },
          ]}>
          {label}
        </Text>
        {glyph ? (
          <Text style={[styles.glyph, { color: v.fg }]}>{glyph}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: { paddingVertical: spacing.lg },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.sm,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  labelLarge: { fontSize: fontSize.md },
  glyph: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.lg,
  },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.4 },
});
