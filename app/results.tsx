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
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';
import { useLoading } from '@/src/hooks/useLoading';
import apiService from '@/src/services/apiService';
import documentService from '@/src/services/documentService';

export default function ResultsScreen() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();
  const params = useLocalSearchParams();
  
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const imageAnalyzer = useLoading(apiService.analyzeImage);
  const textExtractor = useLoading(apiService.extractTextFromImage);
  const audioGenerator = useLoading(documentService.generateDocumentAudio);

  useEffect(() => {
    if (params.imageUri) {
      analyzeContent();
    } else if (params.documentData) {
      // Carrega dados de documento já processado
      try {
        const docData = JSON.parse(params.documentData as string);
        setResult({
          type: 'document',
          data: docData,
          title: params.title || 'Documento',
        });
      } catch (error) {
        console.error('Erro ao carregar dados do documento:', error);
      }
    }
  }, [params]);

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
        setResult({
          type: 'image',
          imageUri: params.imageUri,
          analysis: analysisResult,
          text: textResult?.texto || null,
          source: params.type || 'unknown',
        });

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
              <FontAwesome name="eye" size={20} color={theme.colors.primary} />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Análise Visual
              </Text>
            </View>
            <Text 
              style={[styles.analysisText, { color: theme.colors.text }]}
              accessibilityLabel={`Análise da imagem: ${result.analysis.objeto}`}
            >
              {result.analysis.objeto}
            </Text>
            <Button
              title="🔊 Ouvir Descrição"
              variant="outline"
              onPress={() => generateAudio(result.analysis.objeto)}
              style={styles.audioButton}
              accessibilityLabel="Gerar áudio da descrição"
            />
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
            </View>
            <Text 
              style={[styles.extractedText, { color: theme.colors.text }]}
              accessibilityLabel={`Texto extraído: ${result.text}`}
            >
              {result.text}
            </Text>
            <Button
              title="🔊 Ouvir Texto"
              variant="outline"
              onPress={() => generateAudio(result.text)}
              style={styles.audioButton}
              accessibilityLabel="Gerar áudio do texto"
            />
          </Card>
        )}

        {/* Documento processado */}
        {result.type === 'document' && (
          <>
            {/* Informações do documento */}
            <Card variant="outlined" style={styles.resultCard}>
              <View style={styles.cardHeader}>
                <FontAwesome name="file" size={20} color={theme.colors.success} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Documento
                </Text>
              </View>
              <Text style={[styles.documentTitle, { color: theme.colors.text }]}>
                {result.title}
              </Text>
              {result.data.total_caracteres && (
                <Text style={[styles.documentStats, { color: theme.colors.textSecondary }]}>
                  {result.data.total_caracteres} caracteres • {result.data.total_palavras} palavras
                </Text>
              )}
            </Card>

            {/* Resumo do documento */}
            {result.data.resumo?.resumo && (
              <Card variant="outlined" style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <FontAwesome name="file-text-o" size={20} color={theme.colors.info} />
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    Resumo
                  </Text>
                </View>
                <Text style={[styles.summaryText, { color: theme.colors.text }]}>
                  {result.data.resumo.resumo}
                </Text>
                <Button
                  title="🔊 Ouvir Resumo"
                  variant="outline"
                  onPress={() => generateAudio(result.data.resumo.resumo)}
                  style={styles.audioButton}
                />
              </Card>
            )}

            {/* Texto completo do documento */}
            {result.data.texto_extraido && (
              <Card variant="outlined" style={styles.resultCard}>
                <View style={styles.cardHeader}>
                  <FontAwesome name="align-left" size={20} color={theme.colors.warning} />
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    Texto Completo
                  </Text>
                </View>
                <ScrollView 
                  style={styles.textContainer}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={[styles.fullText, { color: theme.colors.text }]}>
                    {result.data.texto_extraido}
                  </Text>
                </ScrollView>
                <Button
                  title="🔊 Ouvir Documento"
                  variant="outline"
                  onPress={() => generateAudio(result.data.texto_extraido)}
                  style={styles.audioButton}
                />
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  imageCard: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: 300,
  },
  resultCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analysisText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  extractedText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  documentStats: {
    fontSize: 14,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  textContainer: {
    maxHeight: 200,
    marginBottom: 12,
  },
  fullText: {
    fontSize: 14,
    lineHeight: 20,
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
});