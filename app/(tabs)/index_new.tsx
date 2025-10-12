import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Camera, ImageIcon, Play, StopCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { analisarImagem } from '@/services/image_service';
import { triggerHaptic, triggerSuccessPattern, triggerErrorPattern } from '@/utils/haptics';
import { announceForAccessibility } from '@/utils/audio';
import { SPACING_SCALE } from '@/constants/accessibilityDesign';

export default function VisionScreen() {
  const { theme, getFontSize, soundEnabled } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any | null>(null);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      announceForAccessibility('Permissão de galeria necessária');
      await triggerErrorPattern();
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await triggerSuccessPattern();
      announceForAccessibility('Imagem selecionada');
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      announceForAccessibility('Permissão de câmera necessária');
      await triggerErrorPattern();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await triggerSuccessPattern();
      announceForAccessibility('Foto capturada');
      processImage(result.assets[0].uri);
    }
  };

  const processImage = async (imageUri: string) => {
    setLoading(true);
    setVisionResult(null);
    setGeminiResult(null);
    announceForAccessibility('Processando imagem');

    try {
      const response = await analisarImagem(imageUri);

      if ('erro' in response) {
        await triggerErrorPattern();
        announceForAccessibility(`Erro: ${response.erro}`);
        return;
      }

      if ('labels' in response && 'web_entities' in response) {
        setVisionResult(response);
      }

      if ('objeto' in response) {
        setGeminiResult(response.objeto);
        await triggerSuccessPattern();
        announceForAccessibility('Imagem processada com sucesso');
      }
    } catch (error) {
      await triggerErrorPattern();
      announceForAccessibility('Erro ao processar imagem');
    } finally {
      setLoading(false);
    }
  };

  const speakDescription = () => {
    if (!geminiResult || !soundEnabled) return;

    setIsSpeaking(true);
    announceForAccessibility('Iniciando leitura');
    Speech.speak(geminiResult, {
      language: 'pt-BR',
      rate: 0.9,
      pitch: 1.0,
      onDone: () => {
        setIsSpeaking(false);
        announceForAccessibility('Leitura concluída');
      },
      onError: () => {
        setIsSpeaking(false);
        announceForAccessibility('Erro na leitura');
      },
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
    announceForAccessibility('Leitura interrompida');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader
        title="Ver o Mundo"
        subtitle="Análise de imagens com IA"
        icon={<Camera size={48} color={theme.colors.primary} strokeWidth={2.5} />}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedImage ? (
          <Card padding="none" style={styles.imageCard}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel="Imagem selecionada"
              accessibilityRole="image"
            />
          </Card>
        ) : (
          <Card elevated={false} style={styles.placeholderCard}>
            <ImageIcon
              size={72}
              color={theme.colors.textTertiary}
              strokeWidth={1.5}
            />
            <Text
              style={[
                styles.placeholderText,
                {
                  color: theme.colors.textSecondary,
                  fontSize: getFontSize('body'),
                },
              ]}
            >
              Nenhuma imagem selecionada
            </Text>
          </Card>
        )}

        <View style={styles.actionsContainer}>
          <Button
            title="Tirar Foto"
            onPress={takePhoto}
            icon={<Camera size={24} color="#FFFFFF" strokeWidth={2.5} />}
            fullWidth
            accessibilityHint="Abre a câmera para capturar uma nova foto"
          />
          <Button
            title="Escolher da Galeria"
            onPress={pickImage}
            variant="secondary"
            icon={<ImageIcon size={24} color={theme.colors.text} strokeWidth={2.5} />}
            fullWidth
            accessibilityHint="Abre a galeria para selecionar uma imagem"
          />
        </View>

        {loading && (
          <Card style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[
                styles.loadingText,
                {
                  color: theme.colors.text,
                  fontSize: getFontSize('body'),
                },
              ]}
            >
              Analisando imagem...
            </Text>
          </Card>
        )}

        {visionResult && (
          <Card>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.colors.text,
                  fontSize: getFontSize('heading3'),
                },
              ]}
            >
              Objetos Detectados
            </Text>
            {visionResult.labels.map((label: any, index: number) => (
              <View key={index} style={[styles.labelItem, { borderBottomColor: theme.colors.border }]}>
                <Text
                  style={[
                    styles.labelText,
                    {
                      color: theme.colors.text,
                      fontSize: getFontSize('body'),
                    },
                  ]}
                >
                  {label.objeto}
                </Text>
                <Text
                  style={[
                    styles.confidence,
                    {
                      color: theme.colors.success,
                      fontSize: getFontSize('body'),
                    },
                  ]}
                >
                  {(label.confianca * 100).toFixed(0)}%
                </Text>
              </View>
            ))}
          </Card>
        )}

        {geminiResult && (
          <Card>
            <View style={styles.descriptionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.colors.text,
                    fontSize: getFontSize('heading3'),
                  },
                ]}
              >
                Descrição Completa
              </Text>
            </View>
            <Text
              style={[
                styles.description,
                {
                  color: theme.colors.textSecondary,
                  fontSize: getFontSize('body'),
                },
              ]}
            >
              {geminiResult}
            </Text>
            <View style={styles.audioButton}>
              <Button
                title={isSpeaking ? 'Parar Leitura' : 'Ouvir Descrição'}
                onPress={isSpeaking ? stopSpeaking : speakDescription}
                variant="outline"
                icon={
                  isSpeaking ? (
                    <StopCircle size={24} color={theme.colors.primary} strokeWidth={2.5} />
                  ) : (
                    <Play size={24} color={theme.colors.primary} strokeWidth={2.5} />
                  )
                }
                fullWidth
                accessibilityHint="Reproduz a descrição em áudio"
              />
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING_SCALE.lg,
    paddingBottom: SPACING_SCALE.xxxl,
  },
  imageCard: {
    marginBottom: SPACING_SCALE.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 400,
  },
  placeholderCard: {
    alignItems: 'center',
    paddingVertical: SPACING_SCALE.xxxl,
    marginBottom: SPACING_SCALE.lg,
  },
  placeholderText: {
    marginTop: SPACING_SCALE.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: SPACING_SCALE.md,
    marginBottom: SPACING_SCALE.lg,
  },
  loadingCard: {
    alignItems: 'center',
    paddingVertical: SPACING_SCALE.xl,
    marginBottom: SPACING_SCALE.lg,
  },
  loadingText: {
    marginTop: SPACING_SCALE.md,
    fontWeight: '600',
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING_SCALE.md,
  },
  labelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING_SCALE.md,
    borderBottomWidth: 1,
  },
  labelText: {
    flex: 1,
    fontWeight: '500',
  },
  confidence: {
    fontWeight: '700',
    marginLeft: SPACING_SCALE.md,
  },
  descriptionHeader: {
    marginBottom: SPACING_SCALE.md,
  },
  description: {
    lineHeight: 28,
    fontWeight: '500',
  },
  audioButton: {
    marginTop: SPACING_SCALE.lg,
  },
});
