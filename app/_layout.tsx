import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { ThemeProvider } from '@/src/theme/ThemeProvider';
import { AppSettingsProvider } from '@/src/contexts/AppSettingsContext';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';
import CustomSplashScreen from '@/components/SplashScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [showSplash, setShowSplash] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (showSplash) {
    return <CustomSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AppSettingsProvider>
      <ThemeProvider>
        <AuthProvider>
          <StatusBar style="light" backgroundColor="#0F0F0F" />
          <AuthGuard />
        </AuthProvider>
      </ThemeProvider>
    </AppSettingsProvider>
  );
}

function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'forgot-password';

    if (!isAuthenticated && !inAuthGroup) {
      // Não autenticado → login
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Autenticado mas está em tela de login → app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  // Enquanto está carregando, não renderiza nada para evitar flash
  if (loading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="results" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
