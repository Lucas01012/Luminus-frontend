import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { Mic, Play, Pause, Square, Upload, Volume2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Speech from 'expo-speech';
import { useAccessibility, useAccessibleColors, useAccessibleTextStyles } from '@/contexts/AccessibilityContext';

export default function AudioScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hooks de acessibilidade
  const { settings } = useAccessibility();
  const colors = useAccessibleColors();
  const { getTextStyle, getTitleStyle } = useAccessibleTextStyles();

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording - in real app, use expo-av
    setTimeout(() => {
      setIsRecording(false);
      Alert.alert('Gravação', 'Gravação de áudio concluída!');
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  const selectAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        Alert.alert('Arquivo Selecionado', `${result.assets[0].name} foi carregado com sucesso!`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo de áudio');
    }
  };

  const speakSampleText = () => {
    const sampleText = "Este é um exemplo de conversão de texto para fala usando a funcionalidade de áudio do aplicativo";
    
    if (!settings.soundEnabled) {
      Alert.alert('Sons Desabilitados', 'Ative os sons nas configurações para usar esta funcionalidade.');
      return;
    }
    
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(sampleText, {
        language: 'pt-BR',
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
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
      color: colors.features.audio,
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
    section: {
      marginBottom: settings.increasedSpacing ? 40 : 30,
    },
    sectionTitle: {
      fontSize: getTitleStyle(18).fontSize,
      fontWeight: getTitleStyle(18).fontWeight as any,
      color: colors.text.primary,
      marginBottom: settings.increasedSpacing ? 20 : 16,
    },
    recordingContainer: {
      alignItems: 'center',
      paddingVertical: settings.increasedSpacing ? 30 : 20,
      backgroundColor: colors.background.tertiary,
      borderRadius: 12,
      marginBottom: settings.increasedSpacing ? 16 : 12,
    },
    recordButton: {
      width: settings.largeButtons ? 100 : 80,
      height: settings.largeButtons ? 100 : 80,
      backgroundColor: colors.features.audio,
      borderRadius: settings.largeButtons ? 50 : 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: settings.increasedSpacing ? 20 : 16,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
    },
    recordingActive: {
      backgroundColor: colors.status.error,
      transform: [{ scale: settings.largeButtons ? 1.1 : 1.05 }],
    },
    recordingText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(16).fontSize,
      textAlign: 'center',
      fontWeight: settings.boldText ? '500' : '400',
    },
    controlsContainer: {
      flexDirection: settings.largeButtons ? 'column' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: settings.largeButtons ? 12 : 8,
      marginBottom: settings.increasedSpacing ? 16 : 12,
    },
    controlButton: {
      backgroundColor: colors.background.tertiary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: settings.largeButtons ? 18 : 12,
      paddingHorizontal: settings.largeButtons ? 28 : 20,
      borderRadius: 8,
      gap: settings.largeButtons ? 12 : 8,
      minHeight: settings.largeButtons ? 64 : 48,
      minWidth: settings.largeButtons ? 200 : undefined,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
    },
    controlButtonText: {
      color: colors.text.primary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '600',
    },
    fileButton: {
      backgroundColor: colors.features.audio,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: settings.largeButtons ? 18 : 12,
      paddingHorizontal: settings.largeButtons ? 24 : 16,
      borderRadius: 8,
      gap: settings.largeButtons ? 12 : 8,
      minHeight: settings.largeButtons ? 64 : 48,
      marginBottom: settings.increasedSpacing ? 16 : 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
    },
    fileButtonText: {
      color: colors.text.primary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '600',
    },
    fileInfo: {
      backgroundColor: colors.background.tertiary,
      padding: settings.increasedSpacing ? 20 : 16,
      borderRadius: 8,
      marginTop: settings.increasedSpacing ? 16 : 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.features.audio,
    },
    fileName: {
      color: colors.text.primary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '600',
      marginBottom: 4,
    },
    fileSize: {
      color: colors.text.secondary,
      fontSize: getTextStyle(14).fontSize,
      fontWeight: settings.boldText ? '500' : '400',
    },
    speakButton: {
      backgroundColor: colors.status.info,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: settings.largeButtons ? 16 : 12,
      borderRadius: 8,
      gap: 8,
      minHeight: settings.largeButtons ? 56 : 48,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
    },
    speakingActive: {
      backgroundColor: colors.status.success,
    },
    speakButtonText: {
      color: colors.text.primary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '600',
    },
    featuresContainer: {
      backgroundColor: colors.background.tertiary,
      borderRadius: 12,
      padding: settings.increasedSpacing ? 28 : 20,
      marginBottom: settings.increasedSpacing ? 60 : 40,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 4,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: settings.increasedSpacing ? 20 : 12,
      gap: settings.increasedSpacing ? 16 : 12,
      padding: settings.increasedSpacing ? 12 : 8,
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.features.audio,
    },
    featureText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: settings.boldText ? '500' : '400',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🔊</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Áudio</Text>
        <Text style={styles.headerSubtitle}>Gravação e transcrição de áudio</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recording Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gravação de Áudio</Text>
          <View style={styles.recordingContainer}>
            <TouchableOpacity 
              style={[styles.recordButton, isRecording && styles.recordingActive]}
              onPress={isRecording ? stopRecording : startRecording}
              accessible={true}
              accessibilityLabel={isRecording ? "Parar gravação" : "Iniciar gravação"}
              accessibilityHint={isRecording ? "Toque para parar a gravação de áudio" : "Toque para iniciar a gravação de áudio"}
            >
              {isRecording ? (
                <Square size={settings.largeButtons ? 40 : 32} color="#FFFFFF" />
              ) : (
                <Mic size={settings.largeButtons ? 40 : 32} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <Text style={styles.recordingText}>
              {isRecording ? 'Gravando... Toque para parar' : 'Toque para gravar'}
            </Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controles de Reprodução</Text>
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={isPlaying ? pauseAudio : playAudio}
              accessible={true}
              accessibilityLabel={isPlaying ? "Pausar reprodução" : "Reproduzir áudio"}
              accessibilityHint={isPlaying ? "Toque para pausar a reprodução do áudio" : "Toque para reproduzir o áudio"}
            >
              {isPlaying ? (
                <Pause size={settings.largeButtons ? 28 : 24} color={colors.features.audio} />
              ) : (
                <Play size={settings.largeButtons ? 28 : 24} color={colors.features.audio} />
              )}
              <Text style={styles.controlButtonText}>
                {isPlaying ? 'Pausar' : 'Reproduzir'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* File Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Arquivo de Áudio</Text>
          <TouchableOpacity 
            style={styles.fileButton} 
            onPress={selectAudioFile}
            accessible={true}
            accessibilityLabel="Selecionar arquivo de áudio"
            accessibilityHint="Toque para escolher um arquivo de áudio do dispositivo"
          >
            <Upload size={settings.largeButtons ? 24 : 20} color="#FFFFFF" />
            <Text style={styles.fileButtonText}>Escolher Arquivo</Text>
          </TouchableOpacity>
          
          {selectedFile && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>
                Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          )}
        </View>

        {/* Text to Speech */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Texto para Fala</Text>
          <TouchableOpacity 
            style={[styles.speakButton, isSpeaking && styles.speakingActive]}
            onPress={speakSampleText}
            accessible={true}
            accessibilityLabel={isSpeaking ? "Parar fala" : "Falar texto de exemplo"}
            accessibilityHint="Toque para testar a funcionalidade de texto para fala"
          >
            <Volume2 size={settings.largeButtons ? 24 : 20} color="#FFFFFF" />
            <Text style={styles.speakButtonText}>
              {isSpeaking ? 'Parar Fala' : 'Falar Texto de Exemplo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Audio Features */}
        <View style={styles.featuresContainer}>
          
          <View style={styles.featureItem}>
            <Mic size={settings.largeButtons ? 24 : 20} color={colors.features.audio} />
            <Text style={styles.featureText}>Gravação de áudio em tempo real</Text>
          </View>
          <View style={styles.featureItem}>
            <Play size={settings.largeButtons ? 24 : 20} color={colors.features.audio} />
            <Text style={styles.featureText}>Reprodução de arquivos de áudio</Text>
          </View>
          <View style={styles.featureItem}>
            <Volume2 size={settings.largeButtons ? 24 : 20} color={colors.features.audio} />
            <Text style={styles.featureText}>Conversão de texto para fala</Text>
          </View>
          <View style={styles.featureItem}>
            <Upload size={settings.largeButtons ? 24 : 20} color={colors.features.audio} />
            <Text style={styles.featureText}>Upload de arquivos de áudio</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}