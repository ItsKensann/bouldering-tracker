import {
  ShipporiMincho_600SemiBold,
  ShipporiMincho_700Bold,
} from '@expo-google-fonts/shippori-mincho';
import {
  ZenKakuGothicNew_300Light,
  ZenKakuGothicNew_400Regular,
  ZenKakuGothicNew_500Medium,
} from '@expo-google-fonts/zen-kaku-gothic-new';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { colors, fontFamily, fontSize, spacing } from '@/constants/theme';
import { confirmDestructiveAction } from '@/lib/confirm';
import { useSessionStore } from '@/store/useSessionStore';

// Keep the native splash up until local data has either loaded or failed.
SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash may already be hidden during fast refresh.
});

export default function RootLayout() {
  const hydrationStatus = useSessionStore((state) => state.hydrationStatus);
  const retryHydration = useSessionStore((state) => state.retryHydration);
  const resetPersistedData = useSessionStore(
    (state) => state.resetPersistedData,
  );

  const [fontsLoaded] = useFonts({
    ShipporiMincho_600SemiBold,
    ShipporiMincho_700Bold,
    ZenKakuGothicNew_300Light,
    ZenKakuGothicNew_400Regular,
    ZenKakuGothicNew_500Medium,
  });

  // Hold the splash until both fonts and local data are ready, so the first
  // paint already shows the sumi-e typefaces (never the system fallback).
  useEffect(() => {
    if (fontsLoaded && hydrationStatus !== 'pending') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, hydrationStatus]);

  const handleReset = () => {
    confirmDestructiveAction({
      title: 'Reset local data?',
      message: 'This permanently removes the saved sessions that could not be loaded.',
      confirmLabel: 'Reset data',
      onConfirm: resetPersistedData,
    });
  };

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontFamily: fontFamily.serif,
              color: colors.text,
            },
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="session/[id]" options={{ title: 'Session' }} />
        </Stack>

        {!fontsLoaded || hydrationStatus === 'pending' ? (
          <SafeAreaView
            style={styles.centered}
            accessibilityViewIsModal
            accessibilityLabel="Loading saved sessions">
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Loading sessions…</Text>
          </SafeAreaView>
        ) : hydrationStatus === 'error' ? (
          <SafeAreaView style={styles.recovery} accessibilityViewIsModal>
            <Text style={styles.recoveryTitle} accessibilityRole="header">
              Saved data could not be loaded
            </Text>
            <Text style={styles.recoveryMessage}>
              Your sessions have not been overwritten. Retry loading them, or
              reset local data to start empty.
            </Text>
            <View style={styles.recoveryActions}>
              <Button label="Retry" onPress={retryHydration} />
              <Button
                label="Reset local data"
                variant="danger"
                onPress={handleReset}
              />
            </View>
          </SafeAreaView>
        ) : null}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans,
  },
  recovery: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  recoveryTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontFamily: fontFamily.serif,
    textAlign: 'center',
  },
  recoveryMessage: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontFamily: fontFamily.sansLight,
    lineHeight: 24,
    textAlign: 'center',
  },
  recoveryActions: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
