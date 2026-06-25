import {
  Pressable,
  StyleSheet,
  Text,
  type AccessibilityState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, fontSize, fontWeight, radius, spacing } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
  secondary: { bg: colors.surface, fg: colors.text, border: colors.border },
  ghost: { bg: 'transparent', fg: colors.primary },
  danger: { bg: 'transparent', fg: colors.danger, border: colors.border },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
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
      <Text
        style={[styles.label, size === 'lg' && styles.labelLarge, { color: v.fg }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: { paddingVertical: spacing.lg, borderRadius: radius.lg },
  label: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  labelLarge: { fontSize: fontSize.lg, fontWeight: fontWeight.bold },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.4 },
});
