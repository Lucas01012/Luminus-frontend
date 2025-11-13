import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_API_KEY } from '@/src/config/firebase';
import { UserData, AuthResponse } from '@/src/models';

const AUTH_TOKEN_KEY = '@luminus_auth_token';
const USER_DATA_KEY = '@luminus_user_data';

class AuthService {
  private token: string | null = null;
  private user: UserData | null = null;

  async initialize(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);

      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
      }
    } catch (error) {
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: this.getErrorMessage(data.error?.message),
        };
      }

      const token = data.idToken;
      const user: UserData = {
        uid: data.localId,
        email: data.email,
        displayName: data.displayName || email.split('@')[0],
        photoURL: data.photoUrl,
        emailVerified: data.emailVerified || false,
      };

      await this.saveAuthData(token, user);

      return {
        success: true,
        token,
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao fazer login',
      };
    }
  }

  async register(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: this.getErrorMessage(data.error?.message),
        };
      }

      const token = data.idToken;
      
      const user: UserData = {
        uid: data.localId,
        email: data.email,
        displayName: displayName || email.split('@')[0],
        emailVerified: false,
      };

      if (displayName) {
        await this.updateProfile(token, displayName);
      }

      await this.saveAuthData(token, user);

      return {
        success: true,
        token,
        user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao criar conta',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      this.token = null;
      this.user = null;
    } catch (error) {
    }
  }

  async updateProfile(token: string, displayName: string, photoURL?: string): Promise<boolean> {
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
          displayName,
          photoUrl: photoURL,
          returnSecureToken: true,
        }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async sendVerificationEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'VERIFY_EMAIL',
          idToken: token,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: this.getErrorMessage(data.error?.message),
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao enviar email de verificação',
      };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: this.getErrorMessage(data.error?.message),
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao enviar email de recuperação',
      };
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      if (!this.token) return false;

      const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.token,
        }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      this.token = data.id_token;
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.id_token);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async saveAuthData(token: string, user: UserData): Promise<void> {
    this.token = token;
    this.user = user;
    
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, token],
      [USER_DATA_KEY, JSON.stringify(user)],
    ]);
  }

  private getErrorMessage(code?: string): string {
    const messages: Record<string, string> = {
      'EMAIL_EXISTS': 'Este email já está cadastrado',
      'EMAIL_NOT_FOUND': 'Email não encontrado',
      'INVALID_PASSWORD': 'Senha incorreta',
      'INVALID_EMAIL': 'Email inválido',
      'WEAK_PASSWORD': 'Senha muito fraca (mínimo 6 caracteres)',
      'USER_DISABLED': 'Usuário desabilitado',
      'TOO_MANY_ATTEMPTS_TRY_LATER': 'Muitas tentativas. Tente novamente mais tarde',
    };

    return messages[code || ''] || 'Erro ao processar requisição';
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): UserData | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getAuthHeader(): string | null {
    return this.token ? `Bearer ${this.token}` : null;
  }
}

export const authService = new AuthService();
export default authService;
