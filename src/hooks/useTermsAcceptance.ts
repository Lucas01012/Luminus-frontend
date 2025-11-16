import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const TERMS_ACCEPTED_KEY = '@luminus:terms_accepted';

export function useTermsAcceptance() {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    checkTermsAcceptance();
  }, []);

  const checkTermsAcceptance = async () => {
    try {
      const accepted = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
      setHasAccepted(accepted === 'true');
      setIsChecking(false);

      // Se não aceitou, redireciona para tela de termos
      if (accepted !== 'true') {
        router.replace('/terms');
      }
    } catch (error) {
      console.error('Erro ao verificar aceitação dos termos:', error);
      setIsChecking(false);
    }
  };

  const acceptTerms = async () => {
    try {
      await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
      setHasAccepted(true);
      return true;
    } catch (error) {
      console.error('Erro ao salvar aceitação dos termos:', error);
      return false;
    }
  };

  const resetTermsAcceptance = async () => {
    try {
      await AsyncStorage.removeItem(TERMS_ACCEPTED_KEY);
      setHasAccepted(false);
    } catch (error) {
      console.error('Erro ao resetar aceitação dos termos:', error);
    }
  };

  return {
    isChecking,
    hasAccepted,
    acceptTerms,
    resetTermsAcceptance,
  };
}
