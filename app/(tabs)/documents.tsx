import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';

import { useTheme } from '@/src/theme/ThemeProvider';
import { Button, Card } from '@/src/components/ui';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';
import { useLoading } from '@/src/hooks/useLoading';
import documentService from '@/src/services/documentService';

export default function DocumentsScreen() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);

  const documentProcessor = useLoading(documentService.processDocument);

  const supportedFormats = [
    {
      type: 'PDF',
      description: 'Documentos em formato PDF',
      icon: 'file-pdf-o',
      color: theme.colors.error,
      extensions: ['.pdf'],
    },
    {
      type: 'DOCX',
      description: 'Documentos do Microsoft Word',
      icon: 'file-word-o',
      color: theme.colors.info,
      extensions: ['.docx', '.doc'],
    },
    {
      type: 'Imagem',
      description: 'Documentos escaneados',
      icon: 'file-image-o',
      color: theme.colors.success,
      extensions: ['.jpg', '.jpeg', '.png', '.tiff'],
    },
  ];

  const pickDocument = async () => {
    try {
      await triggerFeedback(FeedbackType.LIGHT);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const document = result.assets[0];
        await processDocument(document);
      }
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o documento.');
    }
  };

  const processDocument = async (document: any) => {
    try {
      await triggerFeedback(FeedbackType.MEDIUM);

      const result = await documentProcessor.execute(
        document.uri,
        document.mimeType || 'application/pdf',
        {
          incluirResumo: true,
          extrairEstrutura: true,
        }
      );

      if (result) {
        // Adicionar à lista de documentos recentes
        const newDoc = {
          id: Date.now().toString(),
          name: document.name,
          type: document.mimeType,
          processedAt: new Date().toISOString(),
          result,
        };

        setRecentDocuments(prev => [newDoc, ...prev.slice(0, 4)]);

        // Navegar para os resultados
        router.push({
          pathname: '/results',
          params: { 
            documentData: JSON.stringify(result),
            type: 'document',
            title: document.name 
          }
        });
      }
    } catch (error) {
      console.error('Erro ao processar documento:', error);
      Alert.alert('Erro', 'Não foi possível processar o documento.');
    }
  };

  const openRecentDocument = async (doc: any) => {
    await triggerFeedback(FeedbackType.LIGHT);
    
    router.push({
      pathname: '/results',
      params: { 
        documentData: JSON.stringify(doc.result),
        type: 'document',
        title: doc.name 
      }
    });
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Botão de seleção de documento */}
      <Card variant="elevated" style={styles.uploadCard}>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickDocument}
          disabled={documentProcessor.loading}
          accessibilityLabel="Selecionar documento para processar"
          accessibilityRole="button"
        >
          <View style={[
            styles.uploadIconContainer,
            { backgroundColor: documentProcessor.loading ? theme.colors.surfaceVariant : theme.colors.primaryLight + '20' }
          ]}>
            <FontAwesome 
              name={documentProcessor.loading ? "spinner" : "upload"} 
              size={40} 
              color={theme.colors.primary}
            />
          </View>
          <Text 
            style={[styles.uploadText, { color: theme.colors.text }]}
          >
            {documentProcessor.loading ? 'Processando documento...' : 'Selecionar Documento'}
          </Text>
          <Text 
            style={[styles.uploadSubtext, { color: theme.colors.textSecondary }]}
          >
            {documentProcessor.loading 
              ? 'Extraindo texto e gerando resumo...' 
              : 'PDF, DOCX ou imagens • Apenas 1ª página'
            }
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Erro de processamento */}
      {documentProcessor.error && (
        <Card 
          variant="outlined" 
          style={[styles.errorCard, { borderColor: theme.colors.error, borderWidth: 2 }]}
        >
          <View style={styles.errorContent}>
            <View style={[styles.errorIconContainer, { backgroundColor: theme.colors.error + '15' }]}>
              <FontAwesome name="exclamation-triangle" size={28} color={theme.colors.error} />
            </View>
            <Text style={[styles.errorTitle, { color: theme.colors.error }]}>
              Erro ao processar
            </Text>
            <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
              {documentProcessor.error}
            </Text>
            <Button
              title="Tentar Novamente"
              variant="outline"
              size="large"
              onPress={() => documentProcessor.reset()}
              style={{ marginTop: 16, width: '100%' }}
            />
          </View>
        </Card>
      )}

      {/* Formatos suportados */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="check-circle" size={24} color={theme.colors.success} />
          <Text 
            style={[styles.sectionTitle, { color: theme.colors.text }]}
            accessibilityRole="header"
          >
            Formatos Aceitos
          </Text>
        </View>
        
        <View style={styles.formatsGrid}>
          {supportedFormats.map((format, index) => (
            <Card 
              key={index}
              variant="outlined"
              style={styles.formatCard}
            >
              <View style={styles.formatContent}>
                <View style={[
                  styles.formatIconContainer,
                  { backgroundColor: format.color + '15' }
                ]}>
                  <FontAwesome 
                    name={format.icon as any} 
                    size={32} 
                    color={format.color}
                  />
                </View>
                <View style={styles.formatInfo}>
                  <Text 
                    style={[styles.formatType, { color: theme.colors.text }]}
                  >
                    {format.type}
                  </Text>
                  <Text 
                    style={[styles.formatDesc, { color: theme.colors.textSecondary }]}
                  >
                    {format.description}
                  </Text>
                  <Text 
                    style={[styles.formatExtensions, { color: theme.colors.textDisabled }]}
                  >
                    {format.extensions.join(' • ')}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Documentos recentes */}
      {recentDocuments.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome name="clock-o" size={24} color={theme.colors.info} />
            <Text 
              style={[styles.sectionTitle, { color: theme.colors.text }]}
              accessibilityRole="header"
            >
              Recentes
            </Text>
          </View>
          
          {recentDocuments.map((doc) => (
            <Card 
              key={doc.id}
              variant="outlined"
              style={styles.recentCard}
            >
              <TouchableOpacity 
                style={styles.recentContent}
                onPress={() => openRecentDocument(doc)}
                accessibilityLabel={`Documento ${doc.name}`}
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <View style={[
                  styles.recentIconContainer,
                  { backgroundColor: theme.colors.primary + '15' }
                ]}>
                  <FontAwesome 
                    name="file-text-o" 
                    size={20} 
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.recentDetails}>
                  <Text 
                    style={[styles.recentName, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {doc.name}
                  </Text>
                  <Text 
                    style={[styles.recentDate, { color: theme.colors.textSecondary }]}
                  >
                    {new Date(doc.processedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                <FontAwesome 
                  name="chevron-right" 
                  size={18} 
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      )}

      {/* Recursos disponíveis */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome name="magic" size={24} color={theme.colors.warning} />
          <Text 
            style={[styles.sectionTitle, { color: theme.colors.text }]}
          >
            O que você pode fazer
          </Text>
        </View>
        <Card variant="outlined" style={styles.featuresCard}>
          <View style={styles.featuresList}>
            <View style={styles.featureRow}>
              <View style={[styles.featureBullet, { backgroundColor: theme.colors.success + '20' }]}>
                <FontAwesome name="bolt" size={16} color={theme.colors.success} />
              </View>
              <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                Leitura rápida da primeira página
              </Text>
            </View>
            
            <View style={styles.featureRow}>
              <View style={[styles.featureBullet, { backgroundColor: theme.colors.info + '20' }]}>
                <FontAwesome name="lightbulb-o" size={16} color={theme.colors.info} />
              </View>
              <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                Resumo inteligente com IA
              </Text>
            </View>
            
            <View style={styles.featureRow}>
              <View style={[styles.featureBullet, { backgroundColor: theme.colors.warning + '20' }]}>
                <FontAwesome name="search" size={16} color={theme.colors.warning} />
              </View>
              <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                Extração completa de texto
              </Text>
            </View>
            
            <View style={styles.featureRow}>
              <View style={[styles.featureBullet, { backgroundColor: theme.colors.secondary + '20' }]}>
                <FontAwesome name="picture-o" size={16} color={theme.colors.secondary} />
              </View>
              <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                OCR para documentos escaneados
              </Text>
            </View>
            
            <View style={styles.featureRow}>
              <View style={[styles.featureBullet, { backgroundColor: theme.colors.primary + '20' }]}>
                <FontAwesome name="volume-up" size={16} color={theme.colors.primary} />
              </View>
              <Text style={[styles.featureItem, { color: theme.colors.text }]}>
                Conversão para áudio (TTS)
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 24,
  },
  uploadCard: {
    marginBottom: 24,
  },
  uploadButton: {
    alignItems: 'center',
    padding: 32,
  },
  uploadIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 17,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  errorCard: {
    marginBottom: 24,
  },
  errorContent: {
    alignItems: 'center',
    padding: 24,
  },
  errorIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formatsGrid: {
    gap: 12,
  },
  formatCard: {
    marginBottom: 0,
  },
  formatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  formatIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatInfo: {
    flex: 1,
  },
  formatType: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  formatDesc: {
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 22,
  },
  formatExtensions: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentCard: {
    marginBottom: 12,
  },
  recentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  recentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentDetails: {
    flex: 1,
  },
  recentName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 24,
  },
  recentDate: {
    fontSize: 15,
    fontWeight: '500',
  },
  featuresCard: {
    padding: 0,
  },
  featuresList: {
    padding: 16,
    gap: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureBullet: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureItem: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
  },
});