import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from '@/lib/trpc';
import { queryClient } from '@/lib/tanstack-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@mercado-facil/trpc/router';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useSyncQueriesExternal } from 'react-query-external-sync';
import { Platform } from 'react-native';
import * as ExpoDevice from 'expo-device';
// import * as MMKV from 'expo-sqlite';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  // Set up the sync hook - automatically disabled in production!
  useSyncQueriesExternal({
    queryClient,
    socketURL: "http://localhost:42831", // Default port for React Native DevTools
    deviceName: Platform?.OS || "web", // Platform detection
    platform: Platform?.OS || "web", // Use appropriate platform identifier
    deviceId: Platform?.OS || "web", // Use a PERSISTENT identifier (see note below)
    isDevice: ExpoDevice.isDevice, // Automatically detects real devices vs emulators
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
      // Add any private environment variables you want to monitor
      // Public environment variables are automatically loaded
    },
    // Storage monitoring with CRUD operations
    // mmkvStorage: storage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    // asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
    secureStorageKeys: [
      "userToken",
      "refreshToken",
      "biometricKey",
      "deviceId",
    ], // SecureStore keys to monitor
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider queryClient={queryClient} trpcClient={api}>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }} />
          <PortalHost />
        </ThemeProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}
