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

export default function FileScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);

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

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(extractedText, {
        language: 'pt-BR',
        rate: 0.8,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🌞</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>ARQUIVO</Text>
        <Text style={styles.headerSubtitle}>Processamento de Documentos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* File Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Documento</Text>
          <TouchableOpacity style={styles.selectButton} onPress={selectDocument}>
            <FolderOpen size={20} color="#FFFFFF" />
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
              <FileText size={24} color="#E91E63" />
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
              >
                <Volume2 size={16} color="#FFFFFF" />
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
            <Download size={20} color="#E91E63" />
            <Text style={styles.featureText}>Upload de documentos PDF, Word e Excel</Text>
          </View>
          
          <View style={styles.featureItem}>
            <FileText size={20} color="#E91E63" />
            <Text style={styles.featureText}>Extração automática de texto</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Volume2 size={20} color="#E91E63" />
            <Text style={styles.featureText}>Leitura em voz alta do conteúdo</Text>
          </View>
          
          <View style={styles.featureItem}>
            <FolderOpen size={20} color="#E91E63" />
            <Text style={styles.featureText}>Suporte a múltiplos formatos</Text>
          </View>
        </View>

        {!selectedFile && (
          <View style={styles.instructionsContainer}>
            <FolderOpen size={60} color="#A0AEC0" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D3748',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: '#F7E6A3',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: '#E91E63',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  supportedFormats: {
    color: '#A0AEC0',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fileInfoContainer: {
    marginBottom: 24,
  },
  fileInfo: {
    backgroundColor: '#4A5568',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    color: '#A0AEC0',
    fontSize: 14,
    marginBottom: 2,
  },
  fileType: {
    color: '#A0AEC0',
    fontSize: 12,
  },
  textHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  speakButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  speakingActive: {
    backgroundColor: '#38B2AC',
  },
  speakButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  textContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 8,
    maxHeight: 200,
  },
  textScrollView: {
    padding: 16,
  },
  extractedText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
  },
  featuresContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    color: '#E2E8F0',
    fontSize: 16,
  },
  instructionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 40,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
  },
  instructionsText: {
    color: '#A0AEC0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});