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
      {/* Header */}
      <View style={styles.header}>
        <Text 
          style={[styles.title, { color: theme.colors.text }]}
          accessibilityRole="header"
        >
          Processamento de Documentos
        </Text>
        <Text 
          style={[styles.subtitle, { color: theme.colors.textSecondary }]}
        >
          Extraia texto e informações de seus documentos
        </Text>
      </View>

      {/* Botão de seleção de documento */}
      <Card variant="elevated" style={styles.uploadCard}>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickDocument}
          disabled={documentProcessor.loading}
          accessibilityLabel="Selecionar documento para processar"
          accessibilityRole="button"
        >
          <FontAwesome 
            name={documentProcessor.loading ? "spinner" : "upload"} 
            size={32} 
            color={theme.colors.primary}
          />
          <Text 
            style={[styles.uploadText, { color: theme.colors.text }]}
          >
            {documentProcessor.loading ? 'Processando...' : 'Selecionar Documento'}
          </Text>
          <Text 
            style={[styles.uploadSubtext, { color: theme.colors.textSecondary }]}
          >
            PDF, DOCX ou imagens de documentos
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Erro de processamento */}
      {documentProcessor.error && (
        <Card variant="outlined" style={styles.errorCard}>
          <View style={styles.errorContent}>
            <FontAwesome name="exclamation-circle" size={24} color={theme.colors.error} />
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {documentProcessor.error}
            </Text>
            <Button
              title="Tentar Novamente"
              variant="outline"
              size="small"
              onPress={() => documentProcessor.reset()}
              style={{ marginTop: 12 }}
            />
          </View>
        </Card>
      )}

      {/* Formatos suportados */}
      <View style={styles.section}>
        <Text 
          style={[styles.sectionTitle, { color: theme.colors.text }]}
          accessibilityRole="header"
        >
          Formatos Suportados
        </Text>
        
        <View style={styles.formatsGrid}>
          {supportedFormats.map((format, index) => (
            <Card 
              key={index}
              variant="outlined"
              style={styles.formatCard}
            >
              <View style={styles.formatContent}>
                <FontAwesome 
                  name={format.icon as any} 
                  size={32} 
                  color={format.color}
                />
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
                  {format.extensions.join(', ')}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Documentos recentes */}
      {recentDocuments.length > 0 && (
        <View style={styles.section}>
          <Text 
            style={[styles.sectionTitle, { color: theme.colors.text }]}
            accessibilityRole="header"
          >
            Documentos Recentes
          </Text>
          
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
              >
                <View style={styles.recentInfo}>
                  <FontAwesome 
                    name="file-text" 
                    size={20} 
                    color={theme.colors.primary}
                  />
                  <View style={styles.recentDetails}>
                    <Text 
                      style={[styles.recentName, { color: theme.colors.text }]}
                      numberOfLines={1}
                    >
                      {doc.name}
                    </Text>
                    <Text 
                      style={[styles.recentDate, { color: theme.colors.textSecondary }]}
                    >
                      Processado {new Date(doc.processedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <FontAwesome 
                  name="chevron-right" 
                  size={16} 
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      )}

      {/* Recursos disponíveis */}
      <Card variant="outlined" style={styles.featuresCard}>
        <Text 
          style={[styles.featuresTitle, { color: theme.colors.text }]}
        >
          ✨ Recursos Disponíveis
        </Text>
        <View style={styles.featuresList}>
          <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
            • Extração de texto de PDFs e DOCX
          </Text>
          <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
            • OCR para documentos escaneados
          </Text>
          <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
            • Geração automática de resumos
          </Text>
          <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
            • Busca de palavras-chave
          </Text>
          <Text style={[styles.featureItem, { color: theme.colors.textSecondary }]}>
            • Conversão para áudio (TTS)
          </Text>
        </View>
      </Card>
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
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  uploadCard: {
    marginBottom: 24,
  },
  uploadButton: {
    alignItems: 'center',
    padding: 32,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  errorCard: {
    marginBottom: 16,
  },
  errorContent: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  formatsGrid: {
    gap: 12,
  },
  formatCard: {
    marginBottom: 8,
  },
  formatContent: {
    alignItems: 'center',
    padding: 20,
  },
  formatType: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  formatDesc: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  formatExtensions: {
    fontSize: 12,
    marginTop: 8,
  },
  recentCard: {
    marginBottom: 8,
  },
  recentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  recentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  recentDate: {
    fontSize: 12,
    marginTop: 2,
  },
  featuresCard: {
    marginTop: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    lineHeight: 20,
  },
});