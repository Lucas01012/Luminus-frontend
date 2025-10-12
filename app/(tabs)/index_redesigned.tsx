import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  AccessibilityInfo,
  Platform,
  Animated,
} from 'react-native';
import { Camera, ImageIcon, Volume2, Sparkles, CheckCircle, AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { analisarImagem } from '@/services/image_service';
import { useAccessibility, useAccessibleColors, useAccessibleTextStyles } from '@/contexts/AccessibilityContext';
import { triggerTap, triggerSuccess, triggerError, triggerPress } from '@/utils/haptics';
import { playTapSound, playSuccessSound, playErrorSound } from '@/utils/sound';
import { SHADOWS, BORDER_RADIUS } from '@/constants/colors';

export default function ImageAnalysisScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any | null>(null);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { settings } = useAccessibility();
  const colors = useAccessibleColors();
  const { getTextStyle, getTitleStyle } = useAccessibleTextStyles();

  const pickImage = async () => {
    triggerTap();
    playTapSound();

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      triggerError();
      playErrorSound();
      AccessibilityInfo.announceForAccessibility('Permissão necessária para acessar fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      triggerSuccess();
      playSuccessSound();
      AccessibilityInfo.announceForAccessibility('Imagem selecionada com sucesso');
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    triggerTap();
    playTapSound();

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      triggerError();
      playErrorSound();
      AccessibilityInfo.announceForAccessibility('Permissão necessária para usar a câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      triggerSuccess();
      playSuccessSound();
      AccessibilityInfo.announceForAccessibility('Foto capturada com sucesso');
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (imageUri: string) => {
    setLoading(true);
    setVisionResult(null);
    setGeminiResult(null);
    setShowResults(false);

    try {
      const analisarResponse = await analisarImagem(imageUri);

      if ('erro' in analisarResponse) {
        triggerError();
        playErrorSound();
        AccessibilityInfo.announceForAccessibility(`Erro: ${analisarResponse.erro}`);
        return;
      }

      if ('labels' in analisarResponse && 'web_entities' in analisarResponse) {
        setVisionResult(analisarResponse);
      }

      if ('objeto' in analisarResponse) {
        setGeminiResult(analisarResponse.objeto);
      }

      setShowResults(true);
      triggerSuccess();
      playSuccessSound();
      AccessibilityInfo.announceForAccessibility('Análise concluída com sucesso');
    } catch (error) {
      console.error('Error processing image:', error);
      triggerError();
      playErrorSound();
      AccessibilityInfo.announceForAccessibility('Erro ao processar imagem');
    } finally {
      setLoading(false);
    }
  };

  const speakDescription = async () => {
    if (geminiResult && settings.soundEnabled) {
      triggerPress();
      playTapSound();
      setIsSpeaking(true);
      AccessibilityInfo.announceForAccessibility('Iniciando leitura da descrição');
      Speech.speak(geminiResult, {
        language: 'pt-BR',
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        onDone: () => {
          setIsSpeaking(false);
          AccessibilityInfo.announceForAccessibility('Leitura concluída');
        },
        onError: () => {
          setIsSpeaking(false);
          triggerError();
          AccessibilityInfo.announceForAccessibility('Erro ao ler descrição');
        },
      });
    }
  };

  const stopSpeaking = () => {
    triggerTap();
    Speech.stop();
    setIsSpeaking(false);
    AccessibilityInfo.announceForAccessibility('Leitura interrompida');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      paddingTop: 60,
      paddingBottom: settings.increasedSpacing ? 32 : 24,
      paddingHorizontal: settings.increasedSpacing ? 24 : 20,
      alignItems: 'center',
    },
    mascotContainer: {
      width: settings.largeButtons ? 96 : 80,
      height: settings.largeButtons ? 96 : 80,
      borderRadius: BORDER_RADIUS.xxl,
      backgroundColor: colors.surface.level2,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: settings.increasedSpacing ? 20 : 16,
      ...SHADOWS.md,
    },
    mascotImage: {
      width: '100%',
      height: '100%',
      borderRadius: BORDER_RADIUS.xxl,
    },
    headerTitle: {
      fontSize: getTitleStyle(32).fontSize,
      fontWeight: getTitleStyle(32).fontWeight as any,
      color: colors.text.primary,
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    headerSubtitle: {
      fontSize: getTextStyle(16).fontSize,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: getTextStyle(16).lineHeight,
    },
    content: {
      flex: 1,
      paddingHorizontal: settings.increasedSpacing ? 24 : 20,
    },
    imageSection: {
      marginBottom: settings.increasedSpacing ? 24 : 20,
    },
    imageCard: {
      width: '100%',
      height: settings.largeButtons ? 280 : 240,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      backgroundColor: colors.surface.level1,
      ...SHADOWS.lg,
    },
    selectedImage: {
      width: '100%',
      height: '100%',
    },
    placeholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface.level2,
      borderWidth: 2,
      borderColor: colors.interactive.border,
      borderStyle: 'dashed',
    },
    placeholderIcon: {
      marginBottom: 16,
      opacity: 0.6,
    },
    placeholderText: {
      color: colors.text.tertiary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '500',
    },
    actionButtons: {
      flexDirection: settings.largeButtons ? 'column' : 'row',
      gap: settings.increasedSpacing ? 16 : 12,
      marginBottom: settings.increasedSpacing ? 32 : 24,
    },
    button: {
      flex: settings.largeButtons ? 0 : 1,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      minHeight: settings.largeButtons ? 64 : 56,
      ...SHADOWS.md,
    },
    buttonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: settings.largeButtons ? 18 : 16,
      paddingHorizontal: settings.largeButtons ? 24 : 20,
      gap: settings.largeButtons ? 12 : 10,
    },
    buttonText: {
      color: colors.text.inverse,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    loadingCard: {
      backgroundColor: colors.surface.level1,
      borderRadius: BORDER_RADIUS.lg,
      padding: settings.increasedSpacing ? 48 : 40,
      alignItems: 'center',
      marginBottom: settings.increasedSpacing ? 24 : 20,
      ...SHADOWS.md,
    },
    loadingText: {
      color: colors.text.primary,
      marginTop: 20,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '500',
    },
    resultsCard: {
      backgroundColor: colors.surface.level1,
      borderRadius: BORDER_RADIUS.lg,
      padding: settings.increasedSpacing ? 24 : 20,
      marginBottom: settings.increasedSpacing ? 20 : 16,
      ...SHADOWS.md,
    },
    resultsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: settings.increasedSpacing ? 20 : 16,
    },
    resultsTitle: {
      fontSize: getTitleStyle(20).fontSize,
      fontWeight: getTitleStyle(20).fontWeight as any,
      color: colors.text.primary,
      flex: 1,
    },
    speakButton: {
      backgroundColor: colors.features.audioSurface,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: settings.largeButtons ? 12 : 10,
      paddingHorizontal: settings.largeButtons ? 16 : 14,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: colors.features.audio,
    },
    speakButtonText: {
      color: colors.features.audio,
      fontSize: getTextStyle(14).fontSize,
      fontWeight: '600',
    },
    descriptionText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(16).fontSize,
      lineHeight: settings.increasedSpacing ? 28 : 24,
    },
    labelItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: settings.increasedSpacing ? 14 : 12,
      paddingHorizontal: settings.increasedSpacing ? 16 : 14,
      backgroundColor: colors.surface.level2,
      borderRadius: BORDER_RADIUS.sm,
      marginBottom: settings.increasedSpacing ? 10 : 8,
    },
    labelText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(15).fontSize,
      flex: 1,
    },
    confidenceBadge: {
      backgroundColor: colors.primary.surface,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: BORDER_RADIUS.full,
      borderWidth: 1,
      borderColor: colors.primary.main,
    },
    confidenceText: {
      color: colors.primary.main,
      fontSize: getTextStyle(13).fontSize,
      fontWeight: '700',
    },
    sectionDivider: {
      height: 1,
      backgroundColor: colors.interactive.border,
      marginVertical: settings.increasedSpacing ? 20 : 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.mascotContainer}>
          <Image
            source={require('@/assets/images/3.png')}
            style={styles.mascotImage}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel="Mascote do aplicativo Luminus"
          />
        </View>
        <Text style={styles.headerTitle}>Análise de Imagens</Text>
        <Text style={styles.headerSubtitle}>
          Identifique objetos e receba descrições detalhadas
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <View style={styles.imageCard}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            ) : (
              <View style={styles.placeholder}>
                <ImageIcon size={64} color={colors.text.tertiary} style={styles.placeholderIcon} />
                <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Tirar foto"
            accessibilityHint="Abre a câmera para capturar uma nova foto"
          >
            <LinearGradient
              colors={['#FF9500', '#FFB038']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Camera size={settings.largeButtons ? 24 : 22} color={colors.text.inverse} />
              <Text style={styles.buttonText}>Tirar Foto</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Escolher da galeria"
            accessibilityHint="Abre a galeria para selecionar uma imagem"
          >
            <LinearGradient
              colors={['#00BFA5', '#1DE9B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <ImageIcon size={settings.largeButtons ? 24 : 22} color={colors.text.inverse} />
              <Text style={styles.buttonText}>Galeria</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text style={styles.loadingText}>Analisando imagem...</Text>
          </View>
        )}

        {geminiResult && showResults && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>Descrição Completa</Text>
              <TouchableOpacity
                style={styles.speakButton}
                onPress={isSpeaking ? stopSpeaking : speakDescription}
                accessible={true}
                accessibilityLabel={isSpeaking ? 'Parar leitura' : 'Ler descrição'}
              >
                <Volume2 size={18} color={colors.features.audio} />
                <Text style={styles.speakButtonText}>{isSpeaking ? 'Parar' : 'Ler'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.descriptionText}>{geminiResult}</Text>
          </View>
        )}

        {visionResult && showResults && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Objetos Detectados</Text>
            <View style={styles.sectionDivider} />
            {visionResult.labels.slice(0, 5).map((label: any, index: number) => (
              <View key={index} style={styles.labelItem}>
                <Text style={styles.labelText}>{label.objeto}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>
                    {(label.confianca * 100).toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
