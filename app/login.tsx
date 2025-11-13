import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '@/src/theme/ThemeProvider';
import { Input, Button } from '@/src/components/ui';
import { useAuth } from '@/src/contexts/AuthContext';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';
import CrowIcon from '@/components/CrowIcon';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login, register } = useAuth();
  const { triggerFeedback } = useFeedback();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    };

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!isLogin) {
      if (!displayName) {
        newErrors.displayName = 'Nome é obrigatório';
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Confirme sua senha';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      await triggerFeedback(FeedbackType.ERROR);
      return;
    }

    setLoading(true);
    await triggerFeedback(FeedbackType.MEDIUM);

    try {
      const response = isLogin
        ? await login(email, password)
        : await register(email, password, displayName);

      if (response.success) {
        await triggerFeedback(FeedbackType.SUCCESS);
        router.replace('/(tabs)');
      } else {
        await triggerFeedback(FeedbackType.ERROR);
        Alert.alert('Erro', response.error || 'Erro ao processar requisição');
      }
    } catch (error: any) {
      await triggerFeedback(FeedbackType.ERROR);
      Alert.alert('Erro', error.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <CrowIcon size={80} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {isLogin
              ? 'Entre para continuar usando o Luminus'
              : 'Crie sua conta para começar a usar o Luminus'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <Input
              label="Nome completo"
              placeholder="Digite seu nome"
              value={displayName}
              onChangeText={setDisplayName}
              error={errors.displayName}
              leftIcon={<FontAwesome name="user" size={20} color={theme.colors.textSecondary} />}
              autoCapitalize="words"
              editable={!loading}
            />
          )}

          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            leftIcon={<FontAwesome name="envelope" size={20} color={theme.colors.textSecondary} />}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!showPassword}
            leftIcon={<FontAwesome name="lock" size={20} color={theme.colors.textSecondary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome
                  name={showPassword ? 'eye-slash' : 'eye'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            }
            editable={!loading}
          />

          {!isLogin && (
            <Input
              label="Confirmar senha"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              leftIcon={<FontAwesome name="lock" size={20} color={theme.colors.textSecondary} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <FontAwesome
                    name={showConfirmPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              }
              editable={!loading}
            />
          )}

          {isLogin && (
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
                Esqueceu sua senha?
              </Text>
            </TouchableOpacity>
          )}

          <Button
            title={isLogin ? 'Entrar' : 'Criar conta'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
            <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>ou</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
          </View>

          <TouchableOpacity
            style={[styles.toggleButton, { borderColor: theme.colors.outline }]}
            onPress={toggleMode}
            disabled={loading}
          >
            <Text style={[styles.toggleButtonText, { color: theme.colors.text }]}>
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 15,
  },
  toggleButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 17,
    fontWeight: '500',
  },
});
