import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { UserData, AuthResponse } from '@/src/services/authService';
import { AppState, AppStateStatus } from 'react-native';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, displayName?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await authService.initialize();
      const currentUser = authService.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao inicializar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authService.login(email, password);
    
    if (response.success && response.user) {
      setUser(response.user);
    }
    
    return response;
  };

  const register = async (email: string, password: string, displayName?: string): Promise<AuthResponse> => {
    const response = await authService.register(email, password, displayName);
    
    if (response.success && response.user) {
      setUser(response.user);
    }
    
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    return authService.resetPassword(email);
  };

  const sendVerificationEmail = async () => {
    const token = authService.getToken();
    if (!token) {
      return {
        success: false,
        error: 'Nenhum usuário autenticado',
      };
    }
    return authService.sendVerificationEmail(token);
  };

  const refreshAuth = async () => {
    try {
      await authService.initialize();
      const currentUser = authService.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao atualizar autenticação:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && user) {
        refreshAuth();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        sendVerificationEmail,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
