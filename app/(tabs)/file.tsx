import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { FolderOpen, FileText, Volume2, Download } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Speech from 'expo-speech';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { getColors } from '../../constants/colors';
import { TYPOGRAPHY, TEXT_STYLES } from '../../constants/typography';

export default function FileScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hooks de acessibilidade
  const { settings } = useAccessibility();
  const colors = getColors();

  // Funções auxiliares para tipografia dinâmica
  const getTitleStyle = (baseSize: number) => {
    const size = settings.largeButtons ? Math.round(baseSize * 1.3) : baseSize;
    return {
      fontSize: size,
      fontWeight: settings.boldText ? TYPOGRAPHY.fontWeight.bold : TYPOGRAPHY.fontWeight.semibold,
    };
  };

  const getTextStyle = (baseSize: number) => {
    const size = settings.largeButtons ? Math.round(baseSize * 1.2) : baseSize;
    return {
      fontSize: size,
      lineHeight: settings.increasedSpacing ? size * 1.6 : size * 1.4,
    };
  };

  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        // Simulate text extraction
        const mockText = `Este é um texto extraído do arquivo ${result.assets[0].name}. 

Em uma implementação real, aqui seria exibido o conteúdo real do documento PDF, Word ou Excel selecionado.

O texto seria processado usando bibliotecas específicas para cada tipo de arquivo:
- Para PDF: react-native-pdf ou similar
- Para Word: mammoth.js ou similar  
- Para Excel: xlsx ou similar

Este texto simulado demonstra como a funcionalidade funcionaria na prática, permitindo que o usuário visualize o conteúdo extraído e use a função de leitura em voz alta.`;
        
        setExtractedText(mockText);
        Alert.alert('Arquivo Processado', `Texto extraído de ${result.assets[0].name} com sucesso!`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo')
    }
  };

  const speakText = () => {
    if (!extractedText) {
      Alert.alert('Aviso', 'Nenhum texto disponível para leitura');
      return;
    }

    if (!settings.soundEnabled) {
      Alert.alert('Aviso', 'O som está desabilitado nas configurações de acessibilidade');
      return;
    }

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(extractedText, {
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
      color: colors.features.file,
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
    selectButton: {
      backgroundColor: colors.features.file,
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
    selectButtonText: {
      color: colors.text.primary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: '600',
    },
    supportedFormats: {
      color: colors.text.secondary,
      fontSize: getTextStyle(14).fontSize,
      textAlign: 'center',
      fontWeight: settings.boldText ? '500' : '400',
      fontStyle: 'italic',
    },
    fileInfoContainer: {
      marginBottom: settings.increasedSpacing ? 40 : 30,
    },
    fileInfo: {
      backgroundColor: colors.background.tertiary,
      padding: settings.increasedSpacing ? 24 : 16,
      borderRadius: 8,
      flexDirection: settings.largeButtons ? 'column' : 'row',
      alignItems: settings.largeButtons ? 'flex-start' : 'center',
      gap: settings.increasedSpacing ? 16 : 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.features.file,
    },
    fileDetails: {
      flex: 1,
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
      marginBottom: 2,
    },
    fileType: {
      color: colors.text.secondary,
      fontSize: getTextStyle(12).fontSize,
      fontWeight: settings.boldText ? '500' : '400',
    },
    textHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: settings.increasedSpacing ? 20 : 16,
    },
    speakButton: {
      backgroundColor: colors.status.info,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: settings.largeButtons ? 16 : 8,
      paddingHorizontal: settings.largeButtons ? 20 : 12,
      borderRadius: 8,
      gap: settings.largeButtons ? 10 : 6,
      minHeight: settings.largeButtons ? 52 : 36,
      minWidth: settings.largeButtons ? 120 : undefined,
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
      fontSize: getTextStyle(14).fontSize,
      fontWeight: '600',
    },
    textContainer: {
      backgroundColor: colors.background.tertiary,
      borderRadius: 8,
      maxHeight: 200,
      borderLeftWidth: 4,
      borderLeftColor: colors.features.file,
    },
    textScrollView: {
      padding: settings.increasedSpacing ? 20 : 16,
    },
    extractedText: {
      color: colors.text.primary,
      fontSize: getTextStyle(16).fontSize,
      lineHeight: getTextStyle(16).lineHeight,
      fontWeight: settings.boldText ? '500' : '400',
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
    featuresTitle: {
      fontSize: getTitleStyle(18).fontSize,
      fontWeight: getTitleStyle(18).fontWeight as any,
      color: colors.text.primary,
      marginBottom: settings.increasedSpacing ? 20 : 16,
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
      borderLeftColor: colors.features.file,
    },
    featureText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(16).fontSize,
      fontWeight: settings.boldText ? '500' : '400',
    },
    instructionsContainer: {
      alignItems: 'center',
      padding: settings.increasedSpacing ? 40 : 30,
      backgroundColor: colors.background.tertiary,
      borderRadius: 12,
      marginBottom: settings.increasedSpacing ? 40 : 30,
    },
    instructionsTitle: {
      fontSize: getTitleStyle(20).fontSize,
      fontWeight: getTitleStyle(20).fontWeight as any,
      color: colors.text.primary,
      marginTop: settings.increasedSpacing ? 20 : 16,
      marginBottom: settings.increasedSpacing ? 16 : 12,
    },
    instructionsText: {
      color: colors.text.secondary,
      fontSize: getTextStyle(16).fontSize,
      lineHeight: getTextStyle(16).lineHeight,
      textAlign: 'center',
      fontWeight: settings.boldText ? '500' : '400',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>📁</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Arquivo</Text>
        <Text style={styles.headerSubtitle}>Processamento de documentos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* File Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Documento</Text>
          <TouchableOpacity 
            style={styles.selectButton} 
            onPress={selectDocument}
            accessible={true}
            accessibilityLabel="Selecionar documento"
            accessibilityHint="Toque para escolher um arquivo PDF, Word ou Excel"
          >
            <FolderOpen size={settings.largeButtons ? 24 : 20} color="#FFFFFF" />
            <Text style={styles.selectButtonText}>Escolher Arquivo</Text>
          </TouchableOpacity>
          
          <Text style={styles.supportedFormats}>
            Formatos suportados: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
          </Text>
        </View>

        {/* Selected File Info */}
        {selectedFile && (
          <View style={styles.fileInfoContainer}>
            <Text style={styles.sectionTitle}>Arquivo Selecionado</Text>
            <View style={styles.fileInfo}>
              <FileText size={settings.largeButtons ? 28 : 24} color={colors.features.file} />
              <View style={styles.fileDetails}>
                <Text style={styles.fileName}>{selectedFile.name}</Text>
                <Text style={styles.fileSize}>
                  Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Text>
                <Text style={styles.fileType}>
                  Tipo: {selectedFile.mimeType}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <View style={styles.section}>
            <View style={styles.textHeader}>
              <Text style={styles.sectionTitle}>Texto Extraído</Text>
              <TouchableOpacity 
                style={[styles.speakButton, isSpeaking && styles.speakingActive]}
                onPress={speakText}
                accessible={true}
                accessibilityLabel={isSpeaking ? "Parar leitura" : "Ler texto"}
                accessibilityHint="Toque para ouvir o texto extraído do documento"
              >
                <Volume2 size={settings.largeButtons ? 20 : 16} color="#FFFFFF" />
                <Text style={styles.speakButtonText}>
                  {isSpeaking ? 'Parar' : 'Ler'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.textContainer}>
              <ScrollView style={styles.textScrollView} nestedScrollEnabled>
                <Text style={styles.extractedText}>{extractedText}</Text>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Features Info */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Funcionalidades de Arquivo:</Text>
          
          <View style={styles.featureItem}>
            <Download size={settings.largeButtons ? 24 : 20} color={colors.features.file} />
            <Text style={styles.featureText}>Upload de documentos PDF, Word e Excel</Text>
          </View>
          
          <View style={styles.featureItem}>
            <FileText size={settings.largeButtons ? 24 : 20} color={colors.features.file} />
            <Text style={styles.featureText}>Extração automática de texto</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Volume2 size={settings.largeButtons ? 24 : 20} color={colors.features.file} />
            <Text style={styles.featureText}>Leitura em voz alta do conteúdo</Text>
          </View>
          
          <View style={styles.featureItem}>
            <FolderOpen size={20} color="#E91E63" />
            <Text style={styles.featureText}>Suporte a múltiplos formatos</Text>
          </View>
        </View>

        {!selectedFile && (
          <View style={styles.instructionsContainer}>
            <FolderOpen size={settings.largeButtons ? 80 : 60} color={colors.text.secondary} />
            <Text style={styles.instructionsTitle}>Como usar:</Text>
            <Text style={styles.instructionsText}>
              1. Toque em "Escolher Arquivo" para selecionar um documento{'\n'}
              2. O texto será extraído automaticamente{'\n'}
              3. Use o botão "Ler" para ouvir o conteúdo em voz alta
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}


