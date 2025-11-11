import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRIC_ENABLED_KEY = '@luminus_biometric_enabled';
const BIOMETRIC_SESSION_KEY = '@luminus_biometric_session_complete';

class BiometricService {
  /**
   * Verifica se o dispositivo tem hardware biométrico disponível
   */
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retorna os tipos de biometria disponíveis no dispositivo
   */
  async getSupportedTypes(): Promise<string[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const typeNames: string[] = [];

      types.forEach((type) => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            typeNames.push('Digital');
            break;
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            typeNames.push('Face ID');
            break;
          case LocalAuthentication.AuthenticationType.IRIS:
            typeNames.push('Íris');
            break;
        }
      });

      return typeNames;
    } catch (error) {
      return [];
    }
  }

  /**
   * Autentica o usuário usando biometria
   */
  async authenticate(promptMessage?: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const available = await this.isAvailable();
      
      if (!available) {
        return {
          success: false,
          error: 'Biometria não disponível neste dispositivo',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Autentique-se para continuar',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: true, // Força apenas biometria, SEM senha do dispositivo
        fallbackLabel: '', // Remove o botão de fallback
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Autenticação falhou',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao autenticar',
      };
    }
  }

  /**
   * Verifica se o usuário habilitou biometria no app
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Habilita/desabilita biometria no app
   */
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
    } catch (error) {
      throw new Error('Não foi possível salvar configuração de biometria');
    }
  }

  /**
   * Retorna uma mensagem amigável sobre o tipo de biometria disponível
   */
  async getBiometricTypeMessage(): Promise<string> {
    const types = await this.getSupportedTypes();
    
    if (types.length === 0) {
      return 'biometria';
    }
    
    if (types.length === 1) {
      return types[0];
    }
    
    return types.join(' ou ');
  }

  /**
   * Marca que a autenticação biométrica foi concluída nesta sessão
   */
  async markBiometricSessionComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_SESSION_KEY, 'true');
    } catch (error) {
      // Ignora erro
    }
  }

  /**
   * Verifica se a autenticação biométrica foi concluída nesta sessão
   */
  async isBiometricSessionComplete(): Promise<boolean> {
    try {
      const complete = await AsyncStorage.getItem(BIOMETRIC_SESSION_KEY);
      return complete === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Limpa a flag de sessão biométrica completa
   * Deve ser chamado no logout
   */
  async clearBiometricSession(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BIOMETRIC_SESSION_KEY);
    } catch (error) {
      // Ignora erro
    }
  }
}

export const biometricService = new BiometricService();
export default biometricService;
