import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Camera, Upload, Volume2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';
import { analisarImagem } from '@/services/image_service';

export default function ImageUploadScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any | null>(null);
  const [geminiResult, setGeminiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para usar a câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

const processImage = async (imageUri: string) => {
  setLoading(true);
  setVisionResult(null);
  setGeminiResult(null);

  try {
    const analisarResponse = await analisarImagem(imageUri);

    // Verifica se veio erro
    if ('erro' in analisarResponse) {
      Alert.alert('Erro', analisarResponse.erro);
      return;
    }
    // Verifica se é Vision
    if ('labels' in analisarResponse && 'web_entities' in analisarResponse) {
      setVisionResult(analisarResponse);
    }
    // Verifica se é Gemini
    if ('objeto' in analisarResponse) {
      setGeminiResult(analisarResponse.objeto);
    }
  } catch (error) {
    console.error('Error processing image:', error);
    Alert.alert('Erro', 'Não foi possível processar a imagem. Verifique se o servidor está rodando');
  } finally {
    setLoading(false);
  }
};

  const speakDescription = async () => {
    if (geminiResult) {
      setIsSpeaking(true);
      Speech.speak(geminiResult, {
        language: 'pt-BR',
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🌞</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Descrição de Imagens</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Camera size={48} color="#A0AEC0" />
              <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <Upload size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F7931E" />
            <Text style={styles.loadingText}>Processando imagem...</Text>
          </View>
        )}

        {visionResult && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Objetos Detectados</Text>
            {visionResult.labels.map((label: any, index: number) => (
              <View key={index} style={styles.labelItem}>
                <Text style={styles.labelText}>{label.objeto}</Text>
                <Text style={styles.confidenceText}>{(label.confianca * 100).toFixed(0)}%</Text>
              </View>
            ))}

            {visionResult.web_entities.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Entidades Web</Text>
                {visionResult.web_entities.map((entity: any, index: number) => (
                  <View key={index} style={styles.labelItem}>
                    <Text style={styles.labelText}>{entity.descricao}</Text>
                    <Text style={styles.confidenceText}>{(entity.score * 100).toFixed(0)}%</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {geminiResult && (
          <View style={styles.resultsContainer}>
            <View style={styles.descriptionHeader}>
              <Text style={styles.sectionTitle}>Descrição Completa</Text>
              <TouchableOpacity 
                style={styles.speakButton} 
                onPress={isSpeaking ? stopSpeaking : speakDescription}
              >
                <Volume2 size={20} color="#FFFFFF" />
                <Text style={styles.speakButtonText}>
                  {isSpeaking ? 'Parar' : 'Ler Descrição'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.descriptionText}>{geminiResult}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageSection: {
    marginBottom: 20,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#4A5568',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#718096',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#A0AEC0',
    marginTop: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F7931E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#A0AEC0',
    marginTop: 12,
    fontSize: 16,
  },
  resultsContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  labelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#718096',
  },
  labelText: {
    color: '#E2E8F0',
    fontSize: 16,
    flex: 1,
  },
  confidenceText: {
    color: '#F7931E',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionHeader: {
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
  speakButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionText: {
    color: '#E2E8F0',
    fontSize: 16,
    lineHeight: 24,
  },
});