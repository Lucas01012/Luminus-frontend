import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useTheme } from '@/src/theme/ThemeProvider';
import { Button, Card } from '@/src/components/ui';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { 
    triggerFeedback, 
    isVibrationEnabled, 
    isSoundEnabled, 
    toggleVibration, 
    toggleSound 
  } = useFeedback();

  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeFonts, setLargeFonts] = useState(false);

  const handleSettingChange = async (
    setter: (value: boolean) => void,
    currentValue: boolean,
    settingName: string
  ) => {
    await triggerFeedback(FeedbackType.LIGHT);
    setter(!currentValue);
    
    // Anunciar mudança para leitores de tela
    const newValue = !currentValue ? 'ativado' : 'desativado';
    // AccessibilityInfo.announceForAccessibility(`${settingName} ${newValue}`);
  };

  const showAbout = async () => {
    await triggerFeedback(FeedbackType.LIGHT);
    
    Alert.alert(
      'Sobre o Luminus',
      `Versão 1.0.0\n\nLuminus é um assistente visual inteligente que ajuda pessoas com deficiência visual ou baixa visão a identificar objetos, ler textos e processar documentos usando inteligência artificial.\n\n© 2025 Luminus Team`,
      [{ text: 'OK' }]
    );
  };

  const showHelp = async () => {
    await triggerFeedback(FeedbackType.LIGHT);
    
    Alert.alert(
      'Ajuda',
      `Como usar o Luminus:\n\n• Câmera: Tire fotos para análise instantânea\n• Galeria: Selecione imagens existentes\n• Documentos: Processe PDFs e documentos\n• Use gestos de deslizar para navegar\n• Ative o leitor de tela para melhor acessibilidade`,
      [{ text: 'OK' }]
    );
  };

  const resetSettings = async () => {
    await triggerFeedback(FeedbackType.MEDIUM);
    
    Alert.alert(
      'Redefinir Configurações',
      'Tem certeza de que deseja restaurar todas as configurações para o padrão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setAutoSave(true);
            setHighContrast(false);
            setLargeFonts(false);
            // AccessibilityInfo.announceForAccessibility('Configurações redefinidas');
          }
        }
      ]
    );
  };

  const settingSections = [
    {
      title: 'Aparência',
      settings: [
        {
          key: 'darkMode',
          title: 'Modo Escuro',
          description: 'Interface com fundo escuro para melhor contraste',
          value: isDark,
          onToggle: () => handleSettingChange(toggleTheme, !isDark, 'Modo escuro'),
          icon: 'moon-o',
        },
        {
          key: 'highContrast',
          title: 'Alto Contraste',
          description: 'Aumenta o contraste para melhor visibilidade',
          value: highContrast,
          onToggle: () => handleSettingChange(setHighContrast, highContrast, 'Alto contraste'),
          icon: 'adjust',
        },
        {
          key: 'largeFonts',
          title: 'Fontes Grandes',
          description: 'Aumenta o tamanho da fonte em todo o app',
          value: largeFonts,
          onToggle: () => handleSettingChange(setLargeFonts, largeFonts, 'Fontes grandes'),
          icon: 'font',
        },
      ],
    },
    {
      title: 'Feedback',
      settings: [
        {
          key: 'vibration',
          title: 'Vibração',
          description: 'Feedback háptico para ações e notificações',
          value: isVibrationEnabled,
          onToggle: () => handleSettingChange(toggleVibration, !isVibrationEnabled, 'Vibração'),
          icon: 'mobile',
        },
        {
          key: 'sound',
          title: 'Som',
          description: 'Feedback sonoro para interações',
          value: isSoundEnabled,
          onToggle: () => handleSettingChange(toggleSound, !isSoundEnabled, 'Som'),
          icon: 'volume-up',
        },
      ],
    },
    {
      title: 'Funcionalidades',
      settings: [
        {
          key: 'notifications',
          title: 'Notificações',
          description: 'Receber alertas e notificações do sistema',
          value: notifications,
          onToggle: () => handleSettingChange(setNotifications, notifications, 'Notificações'),
          icon: 'bell',
        },
        {
          key: 'autoSave',
          title: 'Salvamento Automático',
          description: 'Salvar resultados automaticamente',
          value: autoSave,
          onToggle: () => handleSettingChange(setAutoSave, autoSave, 'Salvamento automático'),
          icon: 'save',
        },
      ],
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      accessibilityLabel="Configurações do Luminus"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text 
          style={[styles.title, { color: theme.colors.text }]}
          accessibilityRole="header"
        >
          Configurações
        </Text>
        <Text 
          style={[styles.subtitle, { color: theme.colors.textSecondary }]}
        >
          Personalize sua experiência no Luminus
        </Text>
      </View>

      {/* Seções de configurações */}
      {settingSections.map((section, sectionIndex) => (
        <View key={section.title} style={styles.section}>
          <Text 
            style={[styles.sectionTitle, { color: theme.colors.text }]}
            accessibilityRole="header"
          >
            {section.title}
          </Text>
          
          <Card variant="outlined">
            {section.settings.map((setting, settingIndex) => (
              <View key={setting.key}>
                <View 
                  style={[
                    styles.settingRow,
                    settingIndex > 0 && { 
                      borderTopWidth: 1, 
                      borderTopColor: theme.colors.outline 
                    }
                  ]}
                >
                  <FontAwesome 
                    name={setting.icon as any} 
                    size={20} 
                    color={theme.colors.primary}
                    style={styles.settingIcon}
                  />
                  
                  <View style={styles.settingInfo}>
                    <Text 
                      style={[styles.settingTitle, { color: theme.colors.text }]}
                    >
                      {setting.title}
                    </Text>
                    <Text 
                      style={[styles.settingDesc, { color: theme.colors.textSecondary }]}
                    >
                      {setting.description}
                    </Text>
                  </View>
                  
                  <Switch
                    value={setting.value}
                    onValueChange={setting.onToggle}
                    trackColor={{
                      false: theme.colors.outline,
                      true: theme.colors.primary + '50',
                    }}
                    thumbColor={setting.value ? theme.colors.primary : theme.colors.textSecondary}
                    accessibilityLabel={`${setting.title} - ${setting.value ? 'ativado' : 'desativado'}`}
                    accessibilityRole="switch"
                  />
                </View>
              </View>
            ))}
          </Card>
        </View>
      ))}

      {/* Botões de ação */}
      <View style={styles.actions}>
        <Button
          title="Ajuda"
          variant="outline"
          onPress={showHelp}
          style={styles.actionButton}
          accessibilityLabel="Obter ajuda sobre como usar o Luminus"
        />
        
        <Button
          title="Sobre"
          variant="outline"
          onPress={showAbout}
          style={styles.actionButton}
          accessibilityLabel="Informações sobre o aplicativo Luminus"
        />
      </View>

      {/* Botão de reset */}
      <Card variant="outlined" style={styles.resetCard}>
        <View style={styles.resetContent}>
          <FontAwesome 
            name="refresh" 
            size={24} 
            color={theme.colors.warning}
          />
          <View style={styles.resetInfo}>
            <Text 
              style={[styles.resetTitle, { color: theme.colors.text }]}
            >
              Redefinir Configurações
            </Text>
            <Text 
              style={[styles.resetDesc, { color: theme.colors.textSecondary }]}
            >
              Restaurar todas as configurações para o padrão
            </Text>
          </View>
          <Button
            title="Redefinir"
            variant="ghost"
            size="small"
            onPress={resetSettings}
            accessibilityLabel="Redefinir todas as configurações para o padrão"
          />
        </View>
      </Card>

      {/* Informações do sistema */}
      <Card variant="outlined" style={styles.systemCard}>
        <Text 
          style={[styles.systemTitle, { color: theme.colors.text }]}
        >
          🔧 Informações do Sistema
        </Text>
        <View style={styles.systemInfo}>
          <Text style={[styles.systemItem, { color: theme.colors.textSecondary }]}>
            Plataforma: {Platform.OS === 'ios' ? 'iOS' : 'Android'}
          </Text>
          <Text style={[styles.systemItem, { color: theme.colors.textSecondary }]}>
            Versão: 1.0.0
          </Text>
          <Text style={[styles.systemItem, { color: theme.colors.textSecondary }]}>
            Tema: {isDark ? 'Escuro' : 'Claro'}
          </Text>
        </View>
      </Card>
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
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    marginRight: 16,
    width: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  resetCard: {
    marginBottom: 16,
  },
  resetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  resetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resetTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  resetDesc: {
    fontSize: 14,
    lineHeight: 18,
  },
  systemCard: {
    marginBottom: 32,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  systemInfo: {
    gap: 4,
  },
  systemItem: {
    fontSize: 14,
  },
});