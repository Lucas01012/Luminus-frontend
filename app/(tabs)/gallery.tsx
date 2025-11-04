import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

import { useTheme } from '@/src/theme/ThemeProvider';
import { Button, Card } from '@/src/components/ui';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';
import { apiService } from '@/src/services/apiService';

export default function GalleryScreen() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickImageFromLibrary = async () => {
    try {
      await triggerFeedback(FeedbackType.LIGHT);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        setIsAnalyzing(true);
        await triggerFeedback(FeedbackType.MEDIUM);

        const analysisResult = await apiService.analyzeImage(imageUri, 'gemini');
        
        setIsAnalyzing(false);

        if (analysisResult.success) {
          await triggerFeedback(FeedbackType.SUCCESS);
          
          router.push({
            pathname: '/results',
            params: { 
              imageUri, 
              type: 'gallery',
              analysisResult: JSON.stringify(analysisResult.data)
            }
          });
        } else {
          await triggerFeedback(FeedbackType.ERROR);
          
          const errorMsg = analysisResult.error || 'Não foi possível analisar a imagem.';
          const title = errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('exhausted')
            ? '⏳ API Sobrecarregada'
            : 'Erro na Análise';
          
          Alert.alert(title, errorMsg);
        }
      }
    } catch (error: any) {
      console.error('Erro ao selecionar imagem:', error);
      setIsAnalyzing(false);
      await triggerFeedback(FeedbackType.ERROR);
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text 
            style={[styles.title, { color: theme.colors.text }]}
            accessibilityRole="header"
          >
            Galeria de Imagens
          </Text>
          <Text 
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Selecione uma imagem para análise
          </Text>
        </View>

        <Card variant="elevated" style={styles.selectCard}>
          <View style={styles.iconContainer}>
            <FontAwesome 
              name="photo" 
              size={64} 
              color={theme.colors.primary}
            />
          </View>
          
          <Text style={[styles.selectTitle, { color: theme.colors.text }]}>
            Escolha uma Imagem
          </Text>
          
          <Text style={[styles.selectDescription, { color: theme.colors.textSecondary }]}>
            Selecione uma foto da sua galeria para análise visual com IA
          </Text>

          <Button
            title={isAnalyzing ? "Analisando..." : "Abrir Galeria"}
            onPress={pickImageFromLibrary}
            disabled={isAnalyzing}
            size="large"
            style={styles.selectButton}
            accessibilityLabel="Abrir galeria e selecionar imagem"
          />
        </Card>

        <Card variant="outlined" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <FontAwesome name="check-circle" size={20} color={theme.colors.success} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Análise automática com Gemini AI
            </Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="check-circle" size={20} color={theme.colors.success} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Descrição detalhada da imagem
            </Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="check-circle" size={20} color={theme.colors.success} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Identificação de objetos e contexto
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 16,
  },
  header: {
    marginBottom: 28,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28, // Aumentado de 24 para 28
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17, // Aumentado de 15 para 17
    textAlign: 'center',
    opacity: 0.9,
  },
  selectCard: {
    padding: 28, // Aumentado de 24 para 28
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  selectTitle: {
    fontSize: 24, // Aumentado de 20 para 24
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  selectDescription: {
    fontSize: 17, // Aumentado de 14 para 17
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  selectButton: {
    width: '100%',
    marginTop: 4, // Pequeno espaço do texto acima
  },
  infoCard: {
    padding: 20, // Aumentado de 16 para 20
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14, // Aumentado de 10 para 14
  },
  infoText: {
    fontSize: 16, // Aumentado de 14 para 16
    marginLeft: 12,
    flex: 1,
    lineHeight: 22,
  },
});