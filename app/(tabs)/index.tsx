import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Camera, Upload, Volume2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { analisarImagem } from '@/services/image_service';
import { useAccessibility, useAccessibleColors, useAccessibleTextStyles } from '@/contexts/AccessibilityContext';
import { SPACING, LAYOUT } from '@/constants/spacing';

export default function ImageUploadScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any | null>(null);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hooks de acessibilidade
  const { settings } = useAccessibility();
  const colors = useAccessibleColors();
  const { getTextStyle, getTitleStyle } = useAccessibleTextStyles();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

const processImage = async (imageUri: string) => {
  setLoading(true);
  setVisionResult(null);
  setGeminiResult(null);

  try {
    const analisarResponse = await analisarImagem(imageUri);

    // Verifica se veio erro
    if ('erro' in analisarResponse) {
      Alert.alert('Erro', analisarResponse.erro);
      return;
    }
    // Verifica se é Vision
    if ('labels' in analisarResponse && 'web_entities' in analisarResponse) {
      setVisionResult(analisarResponse);
    }
    // Verifica se é Gemini
    if ('objeto' in analisarResponse) {
      setGeminiResult(analisarResponse.objeto);
    }
  } catch (error) {
    console.error('Error processing image:', error);
    Alert.alert('Erro', 'Não foi possível processar a imagem. Verifique se o servidor está rodando');
  } finally {
    setLoading(false);
  }
};

  const speakDescription = async () => {
    if (geminiResult && settings.soundEnabled) {
      setIsSpeaking(true);
      Speech.speak(geminiResult, {
        language: 'pt-BR',
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Estilos dinâmicos baseados nas configurações de acessibilidade
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: settings.increasedSpacing ? 40 : 30,
      paddingHorizontal: settings.increasedSpacing ? 32 : 24,
    },
    logoContainer: {
      marginBottom: settings.increasedSpacing ? 24 : 20,
    },
    logo: {
      width: settings.largeButtons ? 100 : 80,
      height: settings.largeButtons ? 100 : 80,
      backgroundColor: colors.primary.main,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
    },
    logoText: {
      fontSize: settings.largeButtons ? 42 : 36,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    headerTitle: {
      fontSize: getTitleStyle(28).fontSize,
      fontWeight: getTitleStyle(28).fontWeight as any,
      color: colors.text.primary,
      textAlign: 'center',
      letterSpacing: 1,
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    content: {
      flex: 1,
      paddingHorizontal: settings.increasedSpacing ? 28 : 20,
    },
    imageSection: {
      marginBottom: settings.increasedSpacing ? 28 : 20,
    },
    selectedImage: {
      width: '100%',
      height: settings.largeButtons ? 260 : 240,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    placeholderImage: {
      width: '100%',
      height: settings.largeButtons ? 260 : 240,
      backgroundColor: colors.background.tertiary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.interactive.border,
      borderStyle: 'dashed',
    },
    placeholderText: {
      color: colors.text.tertiary,
      marginTop: 12,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: settings.boldText ? '600' : '400',
    },
    buttonContainer: {
      flexDirection: settings.largeButtons ? 'column' : 'row',
      gap: settings.increasedSpacing ? 16 : 12,
      marginBottom: settings.increasedSpacing ? 28 : 20,
    },
    actionButton: {
      flex: settings.largeButtons ? 0 : 1,
      backgroundColor: colors.primary.main,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: settings.largeButtons ? 18 : 12,
      paddingHorizontal: settings.largeButtons ? 24 : 16,
      borderRadius: 8,
      gap: settings.largeButtons ? 12 : 8,
      minHeight: settings.largeButtons ? 64 : 48,
      maxWidth: settings.largeButtons ? '100%' : undefined,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
    },
    actionButtonText: {
      color: colors.primary.contrast,
      fontWeight: '600',
      fontSize: getTextStyle(16).fontSize,
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: settings.increasedSpacing ? 60 : 40,
    },
    loadingText: {
      color: colors.text.tertiary,
      marginTop: 12,
      fontSize: getTextStyle(16).fontSize,
    },
    resultsContainer: {
      backgroundColor: colors.background.tertiary,
      borderRadius: 12,
      padding: settings.increasedSpacing ? 24 : 16,
      marginBottom: settings.increasedSpacing ? 28 : 20,
    },
    sectionTitle: {
      fontSize: getTitleStyle(18).fontSize,
      fontWeight: getTitleStyle(18).fontWeight as any,
      color: colors.text.primary,
      marginBottom: settings.increasedSpacing ? 16 : 12,
    },
    labelItem: {
      flexDirection: settings.largeButtons ? 'column' : 'row',
      justifyContent: settings.largeButtons ? 'flex-start' : 'space-between',
      alignItems: settings.largeButtons ? 'flex-start' : 'center',
      paddingVertical: settings.increasedSpacing ? 16 : 8,
      paddingHorizontal: settings.increasedSpacing ? 12 : 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.interactive.border,
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      marginBottom: settings.increasedSpacing ? 8 : 4,
    },
    labelText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(16).fontSize,
      flex: settings.largeButtons ? 0 : 1,
      fontWeight: settings.boldText ? '500' : '400',
      marginBottom: settings.largeButtons ? 4 : 0,
    },
    confidenceText: {
      color: colors.primary.main,
      fontSize: getTextStyle(14).fontSize,
      fontWeight: '600',
    },
    descriptionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: settings.increasedSpacing ? 16 : 12,
    },
    speakButton: {
      backgroundColor: colors.features.audio,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: settings.largeButtons ? 20 : 12,
      paddingVertical: settings.largeButtons ? 14 : 8,
      borderRadius: 8,
      gap: settings.largeButtons ? 10 : 6,
      minHeight: settings.largeButtons ? 52 : 36,
      maxWidth: settings.largeButtons ? 200 : undefined,
      alignSelf: settings.largeButtons ? 'flex-end' : 'auto',
    },
    speakButtonText: {
      color: colors.text.primary,
      fontSize: getTextStyle(14).fontSize,
      fontWeight: '600',
    },
    descriptionText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(16).fontSize,
      lineHeight: settings.increasedSpacing ? 28 : 24,
      fontWeight: settings.boldText ? '500' : '400',
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
        <Text style={styles.headerTitle}>Descrição de Imagens</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Camera size={48} color="#A0AEC0" />
              <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Upload size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F7931E" />
            <Text style={styles.loadingText}>Processando imagem...</Text>
          </View>
        )}

        {visionResult && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Objetos Detectados</Text>
            {visionResult.labels.map((label: any, index: number) => (
              <View key={index} style={styles.labelItem}>
                <Text style={styles.labelText}>{label.objeto}</Text>
                <Text style={styles.confidenceText}>{(label.confianca * 100).toFixed(0)}%</Text>
              </View>
            ))}

            {visionResult.web_entities.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Entidades Web</Text>
                {visionResult.web_entities.map((entity: any, index: number) => (
                  <View key={index} style={styles.labelItem}>
                    <Text style={styles.labelText}>{entity.descricao}</Text>
                    <Text style={styles.confidenceText}>{(entity.score * 100).toFixed(0)}%</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {geminiResult && (
          <View style={styles.resultsContainer}>
            <View style={styles.descriptionHeader}>
              <Text style={styles.sectionTitle}>Descrição Completa</Text>
              <TouchableOpacity 
                style={styles.speakButton} 
                onPress={isSpeaking ? stopSpeaking : speakDescription}
              >
                <Volume2 size={20} color="#FFFFFF" />
                <Text style={styles.speakButtonText}>
                  {isSpeaking ? 'Parar' : 'Ler Descrição'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.descriptionText}>{geminiResult}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

