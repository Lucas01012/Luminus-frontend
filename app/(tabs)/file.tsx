import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { FolderOpen, FileText, Volume2, Download, Search, MessageSquare } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Speech from 'expo-speech';
import { 
  processDocumentFile, 
  generateDocumentSummary,
  searchTextInDocument,
  ExtractedData,
  DocumentSummary 
} from '@/services/document_service';
import { generateTextToSpeech } from '@/services/tts_service';

export default function FileScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [documentSummary, setDocumentSummary] = useState<DocumentSummary | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        setIsProcessing(true);
        setExtractedData(null);
        setDocumentSummary(null);

        try {
          // Processa o arquivo usando o document service
          const fileToProcess = {
            uri: result.assets[0].uri,
            name: result.assets[0].name,
            type: result.assets[0].mimeType || 'application/octet-stream'
          };
          
          const extractedResult = await processDocumentFile(fileToProcess);
          
          if (extractedResult.erro) {
            Alert.alert('Erro', extractedResult.erro);
          } else {
            setExtractedData(extractedResult);
            Alert.alert(
              'Documento Processado', 
              `Texto extraído de ${result.assets[0].name} com sucesso!\n\nTotal de caracteres: ${extractedResult.text_content.length}`
            );
          }
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível processar o documento');
          console.error('Erro ao processar documento:', error);
        } finally {
          setIsProcessing(false);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
      setIsProcessing(false);
    }
  };

  const speakText = async () => {
    if (!extractedData?.text_content) {
      Alert.alert('Aviso', 'Nenhum texto disponível para leitura');
      return;
    }

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      
      // Tenta usar o serviço TTS backend primeiro
      const ttsResponse = await generateTextToSpeech(
        extractedData.text_content,
        'pt-BR-Wavenet-A',
        'pt-BR'
      );

      if (ttsResponse.audio_content) {
        // TODO: Implementar reprodução do áudio base64
        Alert.alert('Sucesso', 'Áudio gerado com sucesso! (Reprodução em desenvolvimento)');
        setIsSpeaking(false);
      } else {
        // Fallback para Speech nativo do Expo
        Speech.speak(extractedData.text_content, {
          language: 'pt-BR',
          rate: 0.8,
          pitch: 1.0,
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      }
    } catch (error) {
      console.log('Erro no TTS backend, usando fallback local:', error);
      // Fallback para Speech nativo
      Speech.speak(extractedData.text_content, {
        language: 'pt-BR',
        rate: 0.8,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const generateSummary = async () => {
    if (!extractedData?.text_content) {
      Alert.alert('Aviso', 'Nenhum texto disponível para resumir');
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const summary = await generateDocumentSummary(extractedData.text_content);
      
      if (summary.erro) {
        Alert.alert('Erro', summary.erro);
      } else {
        setDocumentSummary(summary);
        Alert.alert('Resumo Gerado', 'Resumo criado com sucesso!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o resumo');
      console.error('Erro ao gerar resumo:', error);
    } finally {
      setIsGeneratingSummary(false);
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
          <TouchableOpacity 
            style={[styles.selectButton, isProcessing && styles.buttonDisabled]} 
            onPress={selectDocument}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <FolderOpen size={20} color="#FFFFFF" />
            )}
            <Text style={styles.selectButtonText}>
              {isProcessing ? 'Processando...' : 'Escolher Arquivo'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.supportedFormats}>
            Formatos suportados: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Imagens
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
        {extractedData && (
          <View style={styles.section}>
            <View style={styles.textHeader}>
              <Text style={styles.sectionTitle}>Texto Extraído</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.summaryButton, isGeneratingSummary && styles.buttonDisabled]}
                  onPress={generateSummary}
                  disabled={isGeneratingSummary}
                >
                  {isGeneratingSummary ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MessageSquare size={16} color="#FFFFFF" />
                  )}
                  <Text style={styles.actionButtonText}>
                    {isGeneratingSummary ? 'Gerando...' : 'Resumir'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.speakButton, isSpeaking && styles.speakingActive]}
                  onPress={speakText}
                >
                  <Volume2 size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    {isSpeaking ? 'Parar' : 'Ler'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Document Metadata */}
            {extractedData.metadata && (
              <View style={styles.metadataContainer}>
                <Text style={styles.metadataTitle}>Informações do Documento:</Text>
                {extractedData.metadata.total_pages && (
                  <Text style={styles.metadataText}>Páginas: {extractedData.metadata.total_pages}</Text>
                )}
                {extractedData.metadata.title && (
                  <Text style={styles.metadataText}>Título: {extractedData.metadata.title}</Text>
                )}
                {extractedData.metadata.author && (
                  <Text style={styles.metadataText}>Autor: {extractedData.metadata.author}</Text>
                )}
                {extractedData.confidence && (
                  <Text style={styles.metadataText}>Confiança OCR: {(extractedData.confidence * 100).toFixed(1)}%</Text>
                )}
              </View>
            )}
            
            <View style={styles.textContainer}>
              <ScrollView style={styles.textScrollView} nestedScrollEnabled>
                <Text style={styles.extractedText}>{extractedData.text_content}</Text>
              </ScrollView>
            </View>
            
            {/* Document Structure */}
            {extractedData.structure && (
              <View style={styles.structureContainer}>
                <Text style={styles.structureTitle}>Estrutura do Documento:</Text>
                
                {extractedData.structure.headings && extractedData.structure.headings.length > 0 && (
                  <View style={styles.structureSection}>
                    <Text style={styles.structureSubtitle}>Títulos ({extractedData.structure.headings.length}):</Text>
                    {extractedData.structure.headings.slice(0, 5).map((heading, index) => (
                      <Text key={index} style={styles.structureItem}>
                        • {heading.text.substring(0, 50)}{heading.text.length > 50 ? '...' : ''}
                      </Text>
                    ))}
                  </View>
                )}
                
                {extractedData.structure.paragraphs && extractedData.structure.paragraphs.length > 0 && (
                  <View style={styles.structureSection}>
                    <Text style={styles.structureSubtitle}>Parágrafos: {extractedData.structure.paragraphs.length}</Text>
                  </View>
                )}
                
                {extractedData.structure.tables && extractedData.structure.tables.length > 0 && (
                  <View style={styles.structureSection}>
                    <Text style={styles.structureSubtitle}>Tabelas: {extractedData.structure.tables.length}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Document Summary */}
        {documentSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo do Documento</Text>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>{documentSummary.resumo}</Text>
              
              {documentSummary.palavras_chave && documentSummary.palavras_chave.length > 0 && (
                <View style={styles.keywordsContainer}>
                  <Text style={styles.keywordsTitle}>Palavras-chave:</Text>
                  <View style={styles.keywordsList}>
                    {documentSummary.palavras_chave.map((keyword, index) => (
                      <View key={index} style={styles.keywordTag}>
                        <Text style={styles.keywordText}>{keyword}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
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
            <MessageSquare size={20} color="#E91E63" />
            <Text style={styles.featureText}>Geração automática de resumos</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Volume2 size={20} color="#E91E63" />
            <Text style={styles.featureText}>Leitura em voz alta do conteúdo</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Search size={20} color="#E91E63" />
            <Text style={styles.featureText}>Análise de estrutura do documento</Text>
          </View>
        </View>

        {!selectedFile && (
          <View style={styles.instructionsContainer}>
            <FolderOpen size={60} color="#A0AEC0" />
            <Text style={styles.instructionsTitle}>Como usar:</Text>
            <Text style={styles.instructionsText}>
              1. Toque em "Escolher Arquivo" para selecionar um documento{'\n'}
              2. O texto será extraído automaticamente usando IA{'\n'}
              3. Use "Resumir" para gerar um resumo inteligente{'\n'}
              4. Use "Ler" para ouvir o conteúdo em voz alta{'\n'}
              5. Visualize a estrutura e metadados do documento
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
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  summaryButton: {
    backgroundColor: '#9F7AEA',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  metadataContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  metadataTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  metadataText: {
    color: '#A0AEC0',
    fontSize: 12,
    marginBottom: 4,
  },
  structureContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  structureTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  structureSection: {
    marginBottom: 8,
  },
  structureSubtitle: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  structureItem: {
    color: '#A0AEC0',
    fontSize: 11,
    marginLeft: 8,
    marginBottom: 2,
  },
  summaryContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 8,
    padding: 16,
  },
  summaryText: {
    color: '#E2E8F0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  keywordsContainer: {
    marginTop: 8,
  },
  keywordsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordTag: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  keywordText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
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