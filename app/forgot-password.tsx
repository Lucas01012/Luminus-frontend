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

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const { resetPassword } = useAuth();
  const { triggerFeedback } = useFeedback();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    setError('');

    if (!email) {
      setError('Email é obrigatório');
      await triggerFeedback(FeedbackType.ERROR);
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      await triggerFeedback(FeedbackType.ERROR);
      return;
    }

    setLoading(true);
    await triggerFeedback(FeedbackType.MEDIUM);

    try {
      const response = await resetPassword(email);

      if (response.success) {
        await triggerFeedback(FeedbackType.SUCCESS);
        setEmailSent(true);
      } else {
        await triggerFeedback(FeedbackType.ERROR);
        Alert.alert('Erro', response.error || 'Erro ao enviar email');
      }
    } catch (error: any) {
      await triggerFeedback(FeedbackType.ERROR);
      Alert.alert('Erro', error.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: theme.colors.success + '20' }]}>
            <FontAwesome name="check-circle" size={64} color={theme.colors.success} />
          </View>
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>
            Email enviado!
          </Text>
          <Text style={[styles.successText, { color: theme.colors.textSecondary }]}>
            Enviamos um link de recuperação para{'\n'}
            <Text style={{ fontWeight: '600' }}>{email}</Text>
            {'\n\n'}
            Verifique sua caixa de entrada e siga as instruções.
          </Text>
          <Button
            title="Voltar ao login"
            onPress={goBack}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

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
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <FontAwesome name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <FontAwesome name="key" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Recuperar senha
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Digite seu email e enviaremos um link para redefinir sua senha
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            error={error}
            leftIcon={<FontAwesome name="envelope" size={20} color={theme.colors.textSecondary} />}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <Button
            title="Enviar link de recuperação"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
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
  backButton: {
    marginBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
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
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
  },
  form: {
    gap: 20,
  },
  submitButton: {
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
});
