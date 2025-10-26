import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { useTheme } from '@/src/theme/ThemeProvider';
import { Button, Card } from '@/src/components/ui';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();
  

  // Usa o hook de permissões do expo-media-library
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [recentImages, setRecentImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);



  // Solicita permissão apenas se necessário e carrega imagens se permitido
  useEffect(() => {
    if (mediaPermission == null) {
      requestMediaPermission();
    } else if (mediaPermission.granted) {
      loadRecentImages();
    }
    // Não faz nada se negado
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaPermission]);

  // Remove loadMockImages

  const loadRecentImages = async () => {
    try {
      setLoading(true);
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 20,
        mediaType: 'photo',
        sortBy: 'creationTime',
      });
      setRecentImages(assets);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      await triggerFeedback(FeedbackType.LIGHT);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        router.push({
          pathname: '/results',
          params: { imageUri, type: 'gallery' }
        });
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível acessar a galeria.');
    }
  };

  const selectImage = async (image: any) => {
    try {
      await triggerFeedback(FeedbackType.MEDIUM);
      
      // Navegar para análise da imagem selecionada
      router.push({
        pathname: '/results',
        params: { imageUri: image.uri, type: 'gallery' }
      });
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
    }
  };

  if (!mediaPermission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <Text style={[styles.message, { color: theme.colors.text }]}> 
          Solicitando permissão para acessar a galeria...
        </Text>
      </View>
    );
  }

  if (!mediaPermission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <Text style={[styles.message, { color: theme.colors.text }]}> 
          Acesso à galeria negado. Permita o acesso nas configurações.
        </Text>
        <Button
          title="Permitir acesso"
          onPress={requestMediaPermission}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

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
          Galeria de Imagens
        </Text>
        <Text 
          style={[styles.subtitle, { color: theme.colors.textSecondary }]}
        >
          Selecione uma imagem para análise
        </Text>
      </View>

      {/* Botão de seleção rápida */}
      <Card variant="outlined" style={styles.quickSelectCard}>
        <TouchableOpacity 
          style={styles.quickSelectButton}
          onPress={pickImageFromLibrary}
          accessibilityLabel="Selecionar imagem da galeria"
          accessibilityRole="button"
        >
          <FontAwesome 
            name="photo" 
            size={32} 
            color={theme.colors.primary}
          />
          <Text 
            style={[styles.quickSelectText, { color: theme.colors.text }]}
          >
            Selecionar da Galeria
          </Text>
          <Text 
            style={[styles.quickSelectSubtext, { color: theme.colors.textSecondary }]}
          >
            Toque para escolher uma imagem
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Imagens recentes */}
      <View style={styles.section}>
        <Text 
          style={[styles.sectionTitle, { color: theme.colors.text }]}
          accessibilityRole="header"
        >
          Imagens Recentes
        </Text>
        
        {loading ? (
          <Text 
            style={[styles.loadingText, { color: theme.colors.textSecondary }]}
          >
            Carregando imagens...
          </Text>
        ) : recentImages.length > 0 ? (
          <View style={styles.imageGrid}>
            {recentImages.map((image, index) => (
              <TouchableOpacity
                key={image.id || index}
                style={styles.imageItem}
                onPress={() => selectImage(image)}
                accessibilityLabel={`Imagem ${index + 1}`}
                accessibilityRole="button"
                accessibilityHint="Toque duas vezes para selecionar esta imagem para análise"
              >
                <Image 
                  source={{ uri: image.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={[styles.imageOverlay, { backgroundColor: theme.colors.overlay }]}>
                  <FontAwesome 
                    name="search" 
                    size={20} 
                    color={theme.colors.textInverse}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Card variant="outlined" style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <FontAwesome 
                name="photo" 
                size={48} 
                color={theme.colors.textSecondary}
              />
              <Text 
                style={[styles.emptyText, { color: theme.colors.textSecondary }]}
              >
                Nenhuma imagem encontrada
              </Text>
              <Button
                title="Selecionar Imagem"
                onPress={pickImageFromLibrary}
                style={{ marginTop: 16 }}
              />
            </View>
          </Card>
        )}
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
  message: {
    fontSize: 16,
    textAlign: 'center',
    padding: 32,
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
  quickSelectCard: {
    marginBottom: 24,
  },
  quickSelectButton: {
    alignItems: 'center',
    padding: 24,
  },
  quickSelectText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  quickSelectSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    padding: 32,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  imageItem: {
    width: (width - 44) / 2,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});