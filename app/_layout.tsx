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
import biometricService from '@/src/services/biometricService';

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
  const [needsBiometric, setNeedsBiometric] = useState(false);
  const [checkingBiometric, setCheckingBiometric] = useState(true);

  useEffect(() => {
    checkBiometricRequirement();
  }, [isAuthenticated, loading]);

  const checkBiometricRequirement = async () => {
    if (loading) return;
    
    // Se está autenticado, verifica se precisa de biometria
    if (isAuthenticated) {
      const biometricEnabled = await biometricService.isBiometricEnabled();
      const biometricAvailable = await biometricService.isAvailable();
      const sessionComplete = await biometricService.isBiometricSessionComplete();
      
      // Se biometria está habilitada e disponível, sessão não está completa, e não está na tela de biometria
      if (biometricEnabled && biometricAvailable && !sessionComplete && (segments[0] as any) !== 'biometric') {
        setNeedsBiometric(true);
      } else {
        setNeedsBiometric(false);
      }
    } else {
      setNeedsBiometric(false);
    }
    
    setCheckingBiometric(false);
  };

  useEffect(() => {
    if (loading || checkingBiometric) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'forgot-password';
    const inBiometricScreen = segments[0] === 'biometric' as any;

    if (!isAuthenticated && !inAuthGroup) {
      // Não autenticado → login
      router.replace('/login');
    } else if (isAuthenticated && !inBiometricScreen && needsBiometric) {
      // Autenticado mas precisa de biometria → tela biométrica
      router.replace('/biometric' as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Autenticado mas está em tela de login → app
      if (needsBiometric) {
        router.replace('/biometric' as any);
      } else {
        router.replace('/(tabs)');
      }
    } else if (isAuthenticated && inBiometricScreen && !needsBiometric) {
      // Passou pela biometria ou ela foi desabilitada → app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments, needsBiometric, checkingBiometric]);

  // Enquanto está carregando, não renderiza nada para evitar flash
  if (loading || checkingBiometric) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="biometric" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="results" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
