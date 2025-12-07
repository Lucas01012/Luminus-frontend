import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider } from '@/src/theme/ThemeProvider';
import { AppSettingsProvider } from '@/src/contexts/AppSettingsContext';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { FeedbackProvider } from '@/src/contexts/FeedbackContext';
import { StatusBar } from 'expo-status-bar';
import CustomSplashScreen from '@/components/SplashScreen';
import { apiService } from '@/src/services/apiService';

const TERMS_ACCEPTED_KEY = '@luminus:terms_accepted';

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

  // Acordar o backend quando o app carregar
  useEffect(() => {
    wakeUpBackend();
  }, []);

  const wakeUpBackend = async () => {
    try {
      console.log('🔄 Acordando backend (pode demorar até 30s no Render)...');
      const result = await apiService.testConnection();
      if (result.success) {
        console.log(`✅ Backend acordado! (${result.message})`);
      } else {
        console.log('⚠️ Backend pode estar dormindo:', result.message);
      }
    } catch (error) {
      console.log('⚠️ Erro ao acordar backend, tentará novamente nas requisições');
    }
  };

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
        <FeedbackProvider>
          <AuthProvider>
            <StatusBar style="light" backgroundColor="#0F0F0F" />
            <AuthGuard />
          </AuthProvider>
        </FeedbackProvider>
      </ThemeProvider>
    </AppSettingsProvider>
  );
}

function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Verifica se os termos foram aceitos
  useEffect(() => {
    checkTerms();
  }, []);

  const checkTerms = async () => {
    try {
      const accepted = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
      setTermsAccepted(accepted === 'true');
    } catch (error) {
      console.error('Erro ao verificar termos:', error);
      setTermsAccepted(false);
    }
  };

  useEffect(() => {
    if (loading || termsAccepted === null || hasNavigated) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'forgot-password';
    const inTermsScreen = segments[0] === 'terms';
    const inTabsScreen = segments[0] === '(tabs)';
    const inResultsScreen = segments[0] === 'results';

    // Prioridade 1: Se não aceitou termos E não está na tela de termos → vai para termos
    if (!termsAccepted && !inTermsScreen) {
      setHasNavigated(true);
      router.replace('/terms');
      return;
    }

    // Prioridade 2: Se aceitou termos mas não está autenticado E não está no login → vai para login
    if (termsAccepted && !isAuthenticated && !inAuthGroup && !inTermsScreen) {
      setHasNavigated(true);
      router.replace('/login');
      return;
    }

    // Prioridade 3: Se está autenticado E não está nas tabs E não está em results → vai para app
    if (isAuthenticated && !inTabsScreen && !inResultsScreen) {
      setHasNavigated(true);
      router.replace('/(tabs)');
      return;
    }

    // Reset hasNavigated após um tempo para permitir navegação futura se necessário
    const timeout = setTimeout(() => setHasNavigated(false), 1000);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, loading, segments, termsAccepted]);

  // Enquanto está carregando, não renderiza nada para evitar flash
  if (loading || termsAccepted === null) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="terms" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="results" options={{ headerShown: false }} />
    </Stack>
  );
}
