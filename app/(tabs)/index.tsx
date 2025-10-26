import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Image,
  AccessibilityInfo,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useTheme } from '@/src/theme/ThemeProvider';
import { Button, Card } from '@/src/components/ui';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Detecta se o leitor de tela está ativo
  useEffect(() => {
    const checkAccessibility = async () => {
      const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setScreenReaderEnabled(isScreenReaderEnabled);
    };

    checkAccessibility();

    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    return () => subscription?.remove();
  }, []);

  const handleActionPress = async (action: string, route: string) => {
    await triggerFeedback(FeedbackType.LIGHT);
    
    // Anúncio para leitores de tela
    if (screenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(`Abrindo ${action}`);
    }

    router.push(route as any);
  };

  const quickActions = [
    {
      id: 'camera',
      title: 'Capturar Foto',
      description: 'Tire uma foto e analise instantaneamente',
      icon: 'camera',
      route: '/(tabs)/camera',
      color: theme.colors.primary,
    },
    {
      id: 'gallery',
      title: 'Galeria',
      description: 'Selecione uma imagem da galeria',
      icon: 'photo',
      route: '/(tabs)/gallery',
      color: theme.colors.secondary,
    },
    {
      id: 'document',
      title: 'Documentos',
      description: 'Processe PDFs e documentos',
      icon: 'file-text',
      route: '/(tabs)/documents',
      color: theme.colors.success,
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessibilityLabel="Tela principal do Luminus"
    >
      {/* Header com logo e saudação */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome 
            name="eye" 
            size={48} 
            color={theme.colors.primary}
            accessibilityLabel="Logo do Luminus - Olho"
          />
          <Text 
            style={[styles.appName, { color: theme.colors.text }]}
            accessibilityRole="header"
          >
            Luminus
          </Text>
        </View>
        
        <Text 
          style={[styles.welcome, { color: theme.colors.textSecondary }]}
          accessibilityLabel="Bem-vindo ao Luminus, seu assistente visual"
        >
          Seu assistente visual inteligente
        </Text>
      </View>

      {/* Ações rápidas */}
      <View style={styles.section}>
        <Text 
          style={[styles.sectionTitle, { color: theme.colors.text }]}
          accessibilityRole="header"
        >
          Ações Rápidas
        </Text>
        
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Card 
              key={action.id}
              variant="elevated"
              style={[styles.actionCard, { width: (width - 48) / 2 }]}
              accessibilityRole="button"
              accessibilityLabel={`${action.title}. ${action.description}`}
              accessibilityHint="Toque duas vezes para abrir"
            >
              <View style={styles.actionContent}>
                <View 
                  style={[
                    styles.actionIcon, 
                    { backgroundColor: `${action.color}20` }
                  ]}
                >
                  <FontAwesome 
                    name={action.icon as any} 
                    size={24} 
                    color={action.color}
                  />
                </View>
                
                <Text 
                  style={[styles.actionTitle, { color: theme.colors.text }]}
                >
                  {action.title}
                </Text>
                
                <Text 
                  style={[styles.actionDesc, { color: theme.colors.textSecondary }]}
                >
                  {action.description}
                </Text>

                <Button
                  title="Abrir"
                  variant="ghost"
                  size="small"
                  onPress={() => handleActionPress(action.title, action.route)}
                  style={{ marginTop: theme.spacing.sm }}
                  accessibilityLabel={`Abrir ${action.title}`}
                />
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Dicas de acessibilidade */}
      <Card 
        variant="outlined"
        style={styles.tipCard}
        title="💡 Dica de Acessibilidade"
      >
        <Text 
          style={[styles.tipText, { color: theme.colors.text }]}
          accessibilityLabel="Dica: Use gestos de deslizar para navegar entre as abas. Toque duas vezes para ativar botões."
        >
          {screenReaderEnabled 
            ? "Leitor de tela ativo! Use gestos de deslizar para navegar."
            : "Ative o leitor de tela nas configurações para melhor acessibilidade."
          }
        </Text>
      </Card>

      {/* Espaçamento inferior para navegação */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionCard: {
    marginBottom: 16,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  tipCard: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
