/**
 * Standard screen wrapper: applies the app background, safe-area insets, and
 * consistent padding. Pass `scroll` for screens whose content can overflow.
 */
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: readonly Edge[];
  contentStyle?: ViewStyle;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  edges = ['top'],
  contentStyle,
}: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            padded && styles.padded,
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, padded && styles.padded, contentStyle]}
      edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  padded: { padding: spacing.lg },
  scrollContent: { gap: spacing.lg, paddingBottom: spacing.xxl },
});
