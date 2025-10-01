import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Switch,
  Alert 
} from 'react-native';
import { Settings, Eye, Volume2, Vibrate, Type, Palette } from 'lucide-react-native';
import { useAccessibility, useAccessibleColors, useAccessibleTextStyles } from '@/contexts/AccessibilityContext';
import { SPACING, LAYOUT } from '@/constants/spacing';

export default function AccessibilitySettingsScreen() {
  const { settings, updateSettings, resetToDefaults } = useAccessibility();
  const colors = useAccessibleColors();
  const { getTextStyle, getTitleStyle } = useAccessibleTextStyles();

  const showInfo = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Restaurar Configurações Padrão',
      'Isso irá restaurar todas as configurações para os valores padrão. Tem certeza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Restaurar', 
          style: 'destructive',
          onPress: () => {
            resetToDefaults();
            Alert.alert('Sucesso', 'Configurações restauradas para os valores padrão.');
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: LAYOUT.screenPadding,
    },
    logoContainer: {
      marginBottom: 16,
    },
    logo: {
      width: 80,
      height: 80,
      backgroundColor: colors.background.tertiary,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: getTitleStyle(24).fontSize,
      fontWeight: getTitleStyle(24).fontWeight as any,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: getTextStyle(16).fontSize,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: LAYOUT.screenPadding,
    },
    section: {
      marginBottom: SPACING.huge,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.xl,
      gap: SPACING.md,
    },
    sectionTitle: {
      fontSize: getTitleStyle(20).fontSize,
      fontWeight: getTitleStyle(20).fontWeight as any,
      color: colors.text.primary,
    },
    settingItem: {
      flexDirection: settings.largeButtons ? 'column' : 'row',
      alignItems: settings.largeButtons ? 'stretch' : 'center',
      justifyContent: settings.largeButtons ? 'flex-start' : 'space-between',
      backgroundColor: colors.background.tertiary,
      padding: settings.largeButtons ? SPACING.xl : SPACING.lg,
      borderRadius: LAYOUT.cardBorderRadius,
      marginBottom: SPACING.lg,
      minHeight: settings.largeButtons ? 100 : 80,
    },
    settingInfo: {
      flex: 1,
      marginRight: settings.largeButtons ? 0 : SPACING.lg,
      marginBottom: settings.largeButtons ? SPACING.md : 0,
    },
    settingLabel: {
      fontSize: getTextStyle(16).fontSize,
      fontWeight: settings.boldText ? '700' : '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: getTextStyle(14).fontSize,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    fontSizeButtons: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    fontSizeButton: {
      width: settings.largeButtons ? 52 : 44,
      height: settings.largeButtons ? 52 : 44,
      borderRadius: settings.largeButtons ? 26 : 22,
      backgroundColor: colors.background.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    fontSizeButtonActive: {
      backgroundColor: colors.primary.main,
      borderColor: colors.primary.light,
    },
    fontSizeButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text.secondary,
    },
    fontSizeButtonTextActive: {
      color: colors.primary.contrast,
    },
    speedButtons: {
      flexDirection: 'row',
      gap: SPACING.sm,
    },
    speedButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: LAYOUT.buttonBorderRadius,
      backgroundColor: colors.background.secondary,
      borderWidth: 2,
      borderColor: 'transparent',
      minWidth: 50,
      alignItems: 'center',
      minHeight: settings.largeButtons ? 48 : 40,
    },
    speedButtonActive: {
      backgroundColor: colors.features.audio,
      borderColor: colors.status.info,
    },
    speedButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text.secondary,
    },
    speedButtonTextActive: {
      color: colors.text.primary,
    },
    actionButtons: {
      gap: SPACING.lg,
      marginBottom: SPACING.xxxl,
    },
    testButton: {
      backgroundColor: colors.status.info,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.lg,
      borderRadius: LAYOUT.buttonBorderRadius,
      gap: SPACING.sm,
      minHeight: settings.largeButtons ? 64 : 56,
    },
    testButtonText: {
      fontSize: getTextStyle(16).fontSize,
      color: colors.text.primary,
      fontWeight: '600',
    },
    resetButton: {
      backgroundColor: colors.interactive.button_secondary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.lg,
      borderRadius: LAYOUT.buttonBorderRadius,
      gap: SPACING.sm,
      minHeight: settings.largeButtons ? 64 : 56,
    },
    resetButtonText: {
      fontSize: getTextStyle(16).fontSize,
      color: colors.text.primary,
      fontWeight: '600',
    },
    infoBox: {
      backgroundColor: colors.background.tertiary,
      padding: SPACING.xl,
      borderRadius: LAYOUT.cardBorderRadius,
      marginBottom: SPACING.xxxl,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary.main,
    },
    infoText: {
      fontSize: getTextStyle(14).fontSize,
      color: colors.text.secondary,
      lineHeight: 22,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Settings size={32} color={colors.primary.main} />
          </View>
        </View>
        <Text style={styles.headerTitle}>Configurações de Acessibilidade</Text>
        <Text style={styles.headerSubtitle}>Personalize sua experiência</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Seção Visual */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={24} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Visual</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Tamanho da Fonte</Text>
              <Text style={styles.settingDescription}>
                Ajuste o tamanho do texto para melhor legibilidade
              </Text>
            </View>
            <View style={styles.fontSizeButtons}>
              {['small', 'medium', 'large', 'extra-large'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton,
                    settings.fontSize === size && styles.fontSizeButtonActive
                  ]}
                  onPress={() => updateSettings({ fontSize: size as any })}
                  accessibilityRole="button"
                  accessibilityLabel={`Tamanho ${size}`}
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    settings.fontSize === size && styles.fontSizeButtonTextActive
                  ]}>
                    {size === 'small' ? 'P' : size === 'medium' ? 'M' : size === 'large' ? 'G' : 'XG'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Alto Contraste</Text>
              <Text style={styles.settingDescription}>
                Aumenta o contraste para melhor visibilidade
              </Text>
            </View>
            <Switch
              value={settings.highContrast}
              onValueChange={(value) => updateSettings({ highContrast: value })}
              trackColor={{ false: '#666666', true: colors.primary.main }}
              thumbColor={settings.highContrast ? '#FFFFFF' : '#CCCCCC'}
              accessibilityLabel="Alto contraste"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Texto em Negrito</Text>
              <Text style={styles.settingDescription}>
                Deixa todo o texto mais espesso
              </Text>
            </View>
            <Switch
              value={settings.boldText}
              onValueChange={(value) => updateSettings({ boldText: value })}
              trackColor={{ false: '#666666', true: colors.primary.main }}
              thumbColor={settings.boldText ? '#FFFFFF' : '#CCCCCC'}
              accessibilityLabel="Texto em negrito"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Botões Grandes</Text>
              <Text style={styles.settingDescription}>
                Aumenta o tamanho de botões e áreas de toque
              </Text>
            </View>
            <Switch
              value={settings.largeButtons}
              onValueChange={(value) => updateSettings({ largeButtons: value })}
              trackColor={{ false: '#666666', true: colors.primary.main }}
              thumbColor={settings.largeButtons ? '#FFFFFF' : '#CCCCCC'}
              accessibilityLabel="Botões grandes"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Espaçamento Aumentado</Text>
              <Text style={styles.settingDescription}>
                Aumenta o espaço entre elementos
              </Text>
            </View>
            <Switch
              value={settings.increasedSpacing}
              onValueChange={(value) => updateSettings({ increasedSpacing: value })}
              trackColor={{ false: '#666666', true: colors.primary.main }}
              thumbColor={settings.increasedSpacing ? '#FFFFFF' : '#CCCCCC'}
              accessibilityLabel="Espaçamento aumentado"
            />
          </View>
        </View>

        {/* Seção Áudio */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Volume2 size={24} color={colors.features.audio} />
            <Text style={styles.sectionTitle}>Áudio</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sons Ativados</Text>
              <Text style={styles.settingDescription}>
                Reproduz sons de feedback e notificações
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSettings({ soundEnabled: value })}
              trackColor={{ false: '#666666', true: colors.features.audio }}
              thumbColor={settings.soundEnabled ? '#FFFFFF' : '#CCCCCC'}
              accessibilityLabel="Sons ativados"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Velocidade da Fala</Text>
              <Text style={styles.settingDescription}>
                Ajusta a velocidade da leitura em voz alta
              </Text>
            </View>
            <View style={styles.speedButtons}>
              {[0.5, 0.8, 1.0, 1.5].map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedButton,
                    settings.speechRate === speed && styles.speedButtonActive
                  ]}
                  onPress={() => updateSettings({ speechRate: speed })}
                  accessibilityRole="button"
                  accessibilityLabel={`Velocidade ${speed}x`}
                >
                  <Text style={[
                    styles.speedButtonText,
                    settings.speechRate === speed && styles.speedButtonTextActive
                  ]}>
                    {speed}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Seção Interação */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Vibrate size={24} color={colors.status.error} />
            <Text style={styles.sectionTitle}>Interação</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Feedback Tátil</Text>
              <Text style={styles.settingDescription}>
                Vibração ao tocar em botões e elementos
              </Text>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={(value) => updateSettings({ hapticFeedback: value })}
              trackColor={{ false: '#666666', true: colors.status.error }}
              thumbColor={settings.hapticFeedback ? '#FFFFFF' : '#CCCCCC'}
              accessibilityLabel="Feedback tátil"
            />
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={() => showInfo(
              'Teste de Acessibilidade', 
              'Esta funcionalidade permite testar as configurações aplicadas.'
            )}
            accessibilityRole="button"
            accessibilityLabel="Testar configurações"
          >
            <Type size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Testar Configurações</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetSettings}
            accessibilityRole="button"
            accessibilityLabel="Restaurar configurações padrão"
          >
            <Palette size={20} color="#FFFFFF" />
            <Text style={styles.resetButtonText}>Restaurar Padrões</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Dica: Essas configurações são salvas automaticamente e se aplicam a todo o aplicativo.
            Para melhor acessibilidade, recomendamos também ativar o leitor de tela do seu dispositivo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}