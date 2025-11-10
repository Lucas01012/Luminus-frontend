import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/src/theme/ThemeProvider';
import { useAuth } from '@/src/contexts/AuthContext';
import biometricService from '@/src/services/biometricService';
import { router } from 'expo-router';

export default function BiometricScreen() {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [biometricType, setBiometricType] = useState<string>('biometria');
  const [authenticating, setAuthenticating] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initBiometric();
  }, []);

  const initBiometric = async () => {
    const type = await biometricService.getBiometricTypeMessage();
    setBiometricType(type);
    
    // Inicia autenticação automaticamente
    setTimeout(() => {
      handleBiometricAuth();
    }, 500);
  };

  const handleBiometricAuth = async () => {
    setAuthenticating(true);
    setError('');

    const result = await biometricService.authenticate(
      `Use sua ${biometricType} para entrar no Luminus`
    );

    if (result.success) {
      // Marca que a autenticação biométrica foi concluída nesta sessão
      await biometricService.markBiometricSessionComplete();
      // Sucesso - vai para a tela principal
      router.replace('/(tabs)');
    } else {
      setAuthenticating(false);
      // Mensagem de erro mais clara
      if (result.error?.toLowerCase().includes('cancel')) {
        setError('Autenticação cancelada. Tente novamente ou escolha outra opção.');
      } else {
        setError(result.error || 'Falha na autenticação. Tente novamente.');
      }
    }
  };

  const handleUsePassword = async () => {
    // Faz logout e redireciona para login
    await biometricService.clearBiometricSession();
    await logout();
    router.replace('/login');
  };

  const handleSkip = async () => {
    // Marca sessão como completa temporariamente e vai para o app
    await biometricService.markBiometricSessionComplete();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Logo/Ícone */}
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
          <FontAwesome name="unlock-alt" size={80} color={theme.colors.primary} />
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Bem-vindo de volta!
        </Text>

        {/* Descrição */}
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Use sua {biometricType} para acessar o Luminus
        </Text>

        {/* Status */}
        {authenticating && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
              Autenticando...
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <FontAwesome name="exclamation-circle" size={20} color={theme.colors.error} />
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          </View>
        )}

        {/* Botões */}
        <View style={styles.buttonsContainer}>
          {!authenticating && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleBiometricAuth}
              accessibilityLabel="Tentar novamente"
            >
              <FontAwesome name="unlock-alt" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>
                Tentar Novamente
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.outline }]}
            onPress={handleSkip}
            accessibilityLabel="Pular autenticação biométrica"
          >
            <FontAwesome name="arrow-right" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textSecondary }]}>
              Pular por Agora
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.outline }]}
            onPress={handleUsePassword}
            accessibilityLabel="Usar senha"
          >
            <FontAwesome name="key" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textSecondary }]}>
              Usar Email e Senha
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  primaryButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
