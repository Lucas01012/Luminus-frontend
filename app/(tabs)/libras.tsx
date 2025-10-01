import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { Hand, Play, Camera } from 'lucide-react-native';
import { useAccessibility, useAccessibleColors, useAccessibleTextStyles } from '@/contexts/AccessibilityContext';

export default function LibrasScreen() {
  // Hooks de acessibilidade
  const { settings } = useAccessibility();
  const colors = useAccessibleColors();
  const { getTextStyle, getTitleStyle } = useAccessibleTextStyles();

  // Estilos dinâmicos baseados nas configurações de acessibilidade
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: settings.increasedSpacing ? 30 : 20,
      paddingHorizontal: settings.increasedSpacing ? 28 : 20,
    },
    logoContainer: {
      marginBottom: settings.increasedSpacing ? 20 : 16,
    },
    logo: {
      width: settings.largeButtons ? 80 : 60,
      height: settings.largeButtons ? 80 : 60,
      backgroundColor: colors.primary.main,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
    },
    logoText: {
      fontSize: settings.largeButtons ? 36 : 30,
    },
    headerTitle: {
      fontSize: getTitleStyle(28).fontSize,
      fontWeight: getTitleStyle(28).fontWeight as any,
      color: colors.features.libras,
      textAlign: 'center',
      marginBottom: 4,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    headerSubtitle: {
      fontSize: getTextStyle(16).fontSize,
      color: colors.text.secondary,
      textAlign: 'center',
      fontWeight: settings.boldText ? '500' : '400',
    },
    content: {
      flex: 1,
      paddingHorizontal: settings.increasedSpacing ? 28 : 20,
    },
    comingSoonContainer: {
      alignItems: 'center',
      paddingVertical: settings.increasedSpacing ? 60 : 40,
      marginBottom: settings.increasedSpacing ? 40 : 30,
    },
    comingSoonTitle: {
      fontSize: getTitleStyle(32).fontSize,
      fontWeight: getTitleStyle(32).fontWeight as any,
      color: colors.text.primary,
      marginTop: settings.increasedSpacing ? 24 : 20,
      marginBottom: settings.increasedSpacing ? 20 : 16,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    comingSoonText: {
      fontSize: getTextStyle(16).fontSize,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: settings.increasedSpacing ? 28 : 24,
      paddingHorizontal: settings.increasedSpacing ? 24 : 20,
      fontWeight: settings.boldText ? '500' : '400',
    },
    featuresContainer: {
      backgroundColor: colors.background.tertiary,
      borderRadius: 12,
      padding: settings.increasedSpacing ? 28 : 20,
      marginBottom: settings.increasedSpacing ? 40 : 30,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
    },
    featuresTitle: {
      fontSize: getTitleStyle(20).fontSize,
      fontWeight: getTitleStyle(20).fontWeight as any,
      color: colors.text.primary,
      marginBottom: settings.increasedSpacing ? 28 : 20,
    },
    featureItem: {
      flexDirection: settings.largeButtons ? 'column' : 'row',
      alignItems: settings.largeButtons ? 'center' : 'flex-start',
      marginBottom: settings.increasedSpacing ? 32 : 20,
      padding: settings.increasedSpacing ? 24 : 16,
      backgroundColor: colors.background.primary,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.features.libras,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    featureTextContainer: {
      flex: 1,
      marginLeft: settings.largeButtons ? 0 : (settings.increasedSpacing ? 20 : 16),
      marginTop: settings.largeButtons ? 12 : 0,
      alignItems: settings.largeButtons ? 'center' : 'flex-start',
    },
    featureTitle: {
      fontSize: getTextStyle(16).fontSize,
      fontWeight: settings.boldText ? '700' : '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: getTextStyle(14).fontSize,
      color: colors.text.secondary,
      lineHeight: settings.increasedSpacing ? 24 : 20,
      fontWeight: settings.boldText ? '500' : '400',
    },
    notifyButton: {
      backgroundColor: colors.features.libras,
      paddingVertical: settings.largeButtons ? 20 : 16,
      paddingHorizontal: settings.largeButtons ? 32 : 24,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: settings.increasedSpacing ? 60 : 40,
      minHeight: settings.largeButtons ? 64 : 56,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 6,
    },
    notifyButtonText: {
      color: colors.text.primary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🌞</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>LIBRAS</Text>
        <Text style={styles.headerSubtitle}>Tradução para Língua de Sinais</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.comingSoonContainer}>
          <Hand size={settings.largeButtons ? 100 : 80} color={colors.features.libras} />
          <Text style={styles.comingSoonTitle}>Em Breve!</Text>
          <Text style={styles.comingSoonText}>
            Esta funcionalidade permitirá traduzir texto e imagens para LIBRAS (Língua Brasileira de Sinais).
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Funcionalidades Planejadas:</Text>
          
          <View style={styles.featureItem}>
            <Camera size={settings.largeButtons ? 28 : 24} color={colors.features.libras} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Tradução de Imagens</Text>
              <Text style={styles.featureDescription}>
                Capture uma imagem e receba a tradução em LIBRAS
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Play size={settings.largeButtons ? 28 : 24} color={colors.features.libras} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Vídeos em LIBRAS</Text>
              <Text style={styles.featureDescription}>
                Visualize traduções através de vídeos demonstrativos
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Hand size={settings.largeButtons ? 28 : 24} color={colors.features.libras} />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Dicionário LIBRAS</Text>
              <Text style={styles.featureDescription}>
                Acesse um dicionário completo de sinais
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.notifyButton}>
          <Text style={styles.notifyButtonText}>Notificar quando disponível</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

