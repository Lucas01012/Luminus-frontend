import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AccessibilityProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </AccessibilityProvider>
  );
}
