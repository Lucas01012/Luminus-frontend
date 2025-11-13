import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useTheme } from '@/src/theme/ThemeProvider';
import { Button, Card } from '@/src/components/ui';
import { SpeechButton } from '@/src/components/SpeechButton';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';
import { useLoading } from '@/src/hooks/useLoading';
import apiService from '@/src/services/apiService';
import documentService from '@/src/services/documentService';
import historyService from '@/src/services/historyService';
import CrowIcon from '@/components/CrowIcon';

export default function ResultsScreen() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();
  const params = useLocalSearchParams();
  
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const imageAnalyzer = useLoading(apiService.analyzeImage);
  const textExtractor = useLoading(apiService.extractTextFromImage);
  const audioGenerator = useLoading(documentService.generateDocumentAudio);

  useEffect(() => {
    if (hasInitialized) return;
    setHasInitialized(true);

    if (params.analysisResult) {
      try {
        const analysisData = JSON.parse(params.analysisResult as string);
        const resultData = {
          type: 'image',
          imageUri: params.imageUri,
          analysis: analysisData,
          text: null,
          source: params.type || 'unknown',
        };
        setResult(resultData);
        saveToHistory(resultData);
      } catch (error) {
        console.error('Erro ao carregar análise:', error);
      }
    } else if (params.documentData) {
      try {
        const docData = JSON.parse(params.documentData as string);
        const resultData = {
          type: 'document',
          data: docData,
          title: params.title || 'Documento',
        };
        setResult(resultData);
        saveToHistory(resultData);
      } catch (error) {
        console.error('Erro ao carregar documento:', error);
      }
    }
  }, []);

  const generateTitle = (data: any): string => {
    if (data.type === 'image') {
      const description = data.analysis?.objeto || 
                         data.analysis?.descricao || 
                         data.analysis?.data?.objeto ||
                         data.analysis?.data?.descricao || '';
      
      if (description) {
        const firstSentence = description.split(/[.!?]/)[0].trim();
        if (firstSentence.length > 60) {
          return firstSentence.substring(0, 60) + '...';
        }
        return firstSentence || 'Análise de imagem';
      }
      
      if (data.text) {
        const textPreview = data.text.substring(0, 60).trim();
        return textPreview + (data.text.length > 60 ? '...' : '');
      }
      
      return 'Análise de imagem';
    } else if (data.type === 'document') {
      const docData = data.data;
      
      if (docData.metadata?.title) {
        return docData.metadata.title;
      }
      
      if (docData.resumo) {
        const firstLine = docData.resumo.split(/[\n.!?]/)[0].trim();
        if (firstLine.length > 60) {
          return firstLine.substring(0, 60) + '...';
        }
        return firstLine || 'Documento processado';
      }
      
      if (docData.text_content) {
        const firstLine = docData.text_content.split(/[\n.!?]/)[0].trim();
        if (firstLine.length > 60) {
          return firstLine.substring(0, 60) + '...';
        }
        return firstLine || 'Documento processado';
      }
      
      return data.title || 'Documento processado';
    }
    
    return 'Item sem título';
  };

  const saveToHistory = async (data: any) => {
    try {
      if (data.type === 'image') {
        const description = data.analysis?.objeto || 
                           data.analysis?.descricao || 
                           data.analysis?.data?.objeto ||
                           data.analysis?.data?.descricao || '';
        
        let fullContent = '';
        
        if (description) {
          fullContent = `ANÁLISE VISUAL:\n${description}\n\n`;
        }
        
        if (data.text) {
          fullContent += `TEXTO EXTRAÍDO:\n${data.text}`;
        }
        
        if (!fullContent) {
          fullContent = 'Sem conteúdo disponível';
        }
        
        const result = await historyService.addItem({
          type: 'image',
          title: generateTitle(data),
          content: fullContent.trim(),
          imageUri: data.imageUri as string,
          metadata: {
            confidence: data.analysis?.confianca,
            processingTime: data.analysis?.processing_time,
            fileName: data.imageUri?.split('/').pop() || 'image.jpg',
          },
        }, data.analysis);

        if (!result.success) {
          Alert.alert('Aviso', result.error || 'Não foi possível salvar no histórico.');
        }
      } else if (data.type === 'document') {
        const docData = data.data;
        let fullContent = '';
        
        if (docData.resumo) {
          fullContent = `RESUMO:\n${docData.resumo}\n\n`;
        }
        
        if (docData.text_content) {
          fullContent += `TEXTO COMPLETO:\n${docData.text_content}`;
        }
        
        if (!fullContent) {
          fullContent = 'Sem conteúdo disponível';
        }
        
        const result = await historyService.addItem({
          type: 'document',
          title: generateTitle(data),
          content: fullContent.trim(),
          metadata: {
            pages: docData.metadata?.total_pages,
            confidence: docData.confidence,
            keywords: docData.palavras_chave,
            fileName: data.fileName || 'document.pdf',
            fileSize: docData.arquivo_info?.tamanho_bytes,
          },
        }, docData);

        if (!result.success) {
          Alert.alert('Aviso', result.error || 'Não foi possível salvar no histórico.');
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao salvar no histórico');
    }
  };

  const analyzeContent = async () => {
    if (!params.imageUri) return;

    try {
      setIsAnalyzing(true);
      await triggerFeedback(FeedbackType.MEDIUM);

      // Análise da imagem
      const analysisResult = await imageAnalyzer.execute(params.imageUri as string, 'gemini');
      
      // OCR para extrair texto
      const textResult = await textExtractor.execute(params.imageUri as string);

      if (analysisResult || textResult) {
        const resultData = {
          type: 'image',
          imageUri: params.imageUri,
          analysis: analysisResult,
          text: textResult?.texto || null,
          source: params.type || 'unknown',
        };
        setResult(resultData);
        await saveToHistory(resultData);
        await triggerFeedback(FeedbackType.SUCCESS);
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      Alert.alert('Erro', 'Não foi possível analisar o conteúdo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAudio = async (text: string) => {
    try {
      await triggerFeedback(FeedbackType.LIGHT);
      
      const audioResult = await audioGenerator.execute(text, {
        idioma: 'pt-BR',
        voz: 'pt-BR-Wavenet-A',
        velocidade: 1.0,
      });

      if (audioResult) {
        // TODO: Implementar reprodução de áudio quando expo-av estiver disponível
        Alert.alert(
          'Áudio Gerado',
          'A funcionalidade de áudio será ativada quando as dependências estiverem instaladas.'
        );
      }
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
      Alert.alert('Erro', 'Não foi possível gerar o áudio.');
    }
  };

  const shareResult = async () => {
    try {
      await triggerFeedback(FeedbackType.LIGHT);
      
      let message = '';
      
      if (result?.type === 'image') {
        message = `Análise do Luminus:\n\n`;
        if (result.analysis?.objeto) {
          message += `Descrição: ${result.analysis.objeto}\n\n`;
        }
        if (result.text) {
          message += `Texto extraído: ${result.text}\n\n`;
        }
      } else if (result?.type === 'document') {
        message = `Documento processado pelo Luminus:\n\n`;
        message += `Título: ${result.title}\n`;
        if (result.data.resumo?.resumo) {
          message += `Resumo: ${result.data.resumo.resumo}\n\n`;
        }
      }

      message += `Gerado pelo Luminus - Assistente Visual Inteligente`;

      await Share.share({
        message,
        title: 'Resultado do Luminus',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const goBack = async () => {
    await triggerFeedback(FeedbackType.LIGHT);
    router.back();
  };

  if (isAnalyzing || imageAnalyzer.loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <FontAwesome 
          name="spinner" 
          size={48} 
          color={theme.colors.primary}
        />
        <Text 
          style={[styles.loadingText, { color: theme.colors.text }]}
        >
          Analisando conteúdo...
        </Text>
        <Text 
          style={[styles.loadingSubtext, { color: theme.colors.textSecondary }]}
        >
          Isso pode levar alguns segundos
        </Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <FontAwesome 
          name="exclamation-circle" 
          size={48} 
          color={theme.colors.error}
        />
        <Text 
          style={[styles.errorText, { color: theme.colors.text }]}
        >
          Nenhum resultado disponível
        </Text>
        <Button
          title="Voltar"
          onPress={goBack}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.outline }]}>
        <TouchableOpacity
          onPress={goBack}
          accessibilityLabel="Voltar"
          accessibilityRole="button"
        >
          <FontAwesome name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Resultados
        </Text>
        
        <TouchableOpacity
          onPress={shareResult}
          accessibilityLabel="Compartilhar resultado"
          accessibilityRole="button"
        >
          <FontAwesome name="share" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagem (se aplicável) */}
        {result.type === 'image' && result.imageUri && (
          <Card variant="elevated" style={styles.imageCard}>
            <Image 
              source={{ uri: result.imageUri }}
              style={styles.resultImage}
              resizeMode="contain"
              accessibilityLabel="Imagem analisada"
            />
          </Card>
        )}

        {/* Análise da imagem */}
        {result.type === 'image' && result.analysis?.objeto && (
          <Card variant="outlined" style={styles.resultCard}>
            <View style={styles.cardHeader}>
              <CrowIcon size={20} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Análise Visual
              </Text>
              <SpeechButton 
                text={result.analysis.objeto} 
                size={24}
              />
            </View>
            <Text 
              style={[styles.analysisText, { color: theme.colors.text }]}
              accessibilityLabel={`Análise da imagem: ${result.analysis.objeto}`}
            >
              {result.analysis.objeto}
            </Text>
          </Card>
        )}

        {/* Texto extraído */}
        {result.text && (
          <Card variant="outlined" style={styles.resultCard}>
            <View style={styles.cardHeader}>
              <FontAwesome name="file-text" size={20} color={theme.colors.secondary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Texto Extraído
              </Text>
              <SpeechButton 
                text={result.text} 
                size={24}
              />
            </View>
            <Text 
              style={[styles.extractedText, { color: theme.colors.text }]}
              accessibilityLabel={`Texto extraído: ${result.text}`}
            >
              {result.text}
            </Text>
          </Card>
        )}

        {/* Documento processado */}
        {result.type === 'document' && (
          <>
            {/* Informações do documento */}
            <Card variant="outlined" style={styles.resultCard}>
              <View style={styles.cardHeader}>
                <FontAwesome name="file" size={24} color={theme.colors.success} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  📄 Documento
                </Text>
              </View>
              <Text style={[styles.documentTitle, { color: theme.colors.text }]}>
                {result.title}
              </Text>
              
              {/* Metadados (PDF) */}
              {result.data.metadata && (
                <View style={styles.metadataContainer}>
                  {result.data.metadata.total_pages && (
                    <Text style={[styles.documentStats, { color: theme.colors.textSecondary }]}>
                      📄 {result.data.metadata.total_pages} página(s)
                    </Text>
                  )}
                  {result.data.metadata.title && (
                    <Text style={[styles.documentStats, { color: theme.colors.textSecondary }]}>
                      📌 {result.data.metadata.title}
                    </Text>
                  )}
                  {result.data.metadata.author && (
                    <Text style={[styles.documentStats, { color: theme.colors.textSecondary }]}>
                      ✍️ {result.data.metadata.author}
                    </Text>
                  )}
                </View>
              )}
              
              {/* Confiança do OCR (para imagens) */}
              {result.data.confidence && (
                <Text style={[styles.documentStats, { color: theme.colors.textSecondary }]}>
                  🎯 Confiança: {(result.data.confidence * 100).toFixed(0)}%
                </Text>
              )}
            </Card>

            {/* Resumo do documento */}
            {result.data.resumo && (
              <Card variant="outlined" style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <FontAwesome name="file-text-o" size={24} color={theme.colors.info} />
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    📝 Resumo Inteligente
                  </Text>
                  <SpeechButton 
                    text={result.data.resumo} 
                    size={24}
                  />
                </View>
                <Text style={[styles.summaryText, { color: theme.colors.text }]}>
                  {result.data.resumo}
                </Text>
                
                {/* Palavras-chave */}
                {result.data.palavras_chave && result.data.palavras_chave.length > 0 && (
                  <View style={styles.keywordsContainer}>
                    <Text style={[styles.keywordsTitle, { color: theme.colors.textSecondary }]}>
                      🔑 Palavras-chave:
                    </Text>
                    <View style={styles.keywordsList}>
                      {result.data.palavras_chave.map((keyword: string, index: number) => (
                        <View 
                          key={index} 
                          style={[styles.keywordTag, { backgroundColor: theme.colors.primaryLight + '20', borderColor: theme.colors.primary }]}
                        >
                          <Text style={[styles.keywordText, { color: theme.colors.primary }]}>
                            {keyword}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </Card>
            )}

            {/* Estrutura do documento (títulos) */}
            {result.data.structure?.headings && result.data.structure.headings.length > 0 && (
              <Card variant="outlined" style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <FontAwesome name="list" size={24} color={theme.colors.secondary} />
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    📑 Estrutura
                  </Text>
                </View>
                {result.data.structure.headings.slice(0, 5).map((heading: any, index: number) => (
                  <Text 
                    key={index}
                    style={[
                      styles.headingItem, 
                      { 
                        color: theme.colors.text,
                        marginLeft: (heading.level - 1) * 16,
                        fontSize: heading.level === 1 ? 17 : 15,
                        fontWeight: heading.level === 1 ? 'bold' : '600'
                      }
                    ]}
                  >
                    {heading.level === 1 ? '📌' : '▪'} {heading.text}
                  </Text>
                ))}
              </Card>
            )}

            {/* Texto completo do documento */}
            {result.data.text_content && (
              <Card variant="outlined" style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <FontAwesome name="align-left" size={24} color={theme.colors.warning} />
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    📖 Texto Completo
                  </Text>
                  <SpeechButton 
                    text={result.data.text_content} 
                    size={24}
                  />
                </View>
                <ScrollView 
                  style={styles.textContainer}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={[styles.fullText, { color: theme.colors.text }]}>
                    {result.data.text_content}
                  </Text>
                </ScrollView>
              </Card>
            )}
          </>
        )}

        {/* Ações */}
        <View style={styles.actions}>
          <Button
            title="Nova Análise"
            onPress={goBack}
            style={styles.actionButton}
            accessibilityLabel="Fazer nova análise"
          />
          
          <Button
            title="Compartilhar"
            variant="outline"
            onPress={shareResult}
            style={styles.actionButton}
            accessibilityLabel="Compartilhar resultados"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 16,
  },
  imageCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  resultImage: {
    width: 'auto',
    height: 'auto',
  },
  resultCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  analysisText: {
    fontSize: 19,
    lineHeight: 28,
    marginBottom: 12,
  },
  extractedText: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  documentStats: {
    fontSize: 16,
    lineHeight: 24,
  },
  summaryText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 12,
  },
  textContainer: {
    maxHeight: 200,
    marginBottom: 12,
  },
  fullText: {
    fontSize: 16,
    lineHeight: 24,
  },
  audioButton: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  metadataContainer: {
    marginTop: 8,
    gap: 4,
  },
  keywordsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  keywordsTitle: {
    fontSize: 15,
    marginBottom: 8,
    fontWeight: '600',
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  keywordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headingItem: {
    marginBottom: 8,
    lineHeight: 22,
  },
});