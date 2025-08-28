import React, { useState, useEffect } from 'react';
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
import { analisarImagem } from '../../services/image_service';
import Lumi from '../../components/Lumi';
import { useLumiAssistant } from '../../hooks/useLumiAssistant';

interface VisionLabel {
  objeto: string;
  confianca: number;
}

interface WebEntity {
  descricao: string;
  score: number;
}

interface VisionResponse {
  labels: VisionLabel[];
  web_entities: WebEntity[];
}

interface GeminiResponse {
  objeto: string;
  confianca: null;
}

export default function ImageUploadScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visionResults, setVisionResults] = useState<VisionResponse | null>(null);
  const [geminiResults, setGeminiResults] = useState<GeminiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hook do Lumi Assistant
  const { currentMessage, isLumiVisible, lumiSays, clearMessage } = useLumiAssistant();

  // Apresenta o Lumi quando o component carrega
  useEffect(() => {
    setTimeout(() => {
      lumiSays.welcomeUser();
    }, 1000);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
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
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      lumiSays.photoButtonPressed();
      processImage(result.assets[0].uri);
    }
  };

const processImage = async (imageUri: string) => {
  setLoading(true);
  setVisionResults(null);
  setGeminiResults([]);
  
  lumiSays.imageProcessing();

  try {
    const analisarResponse = await analisarImagem(imageUri);

    // Verifica se veio erro
    if ('erro' in analisarResponse) {
      Alert.alert('Erro', analisarResponse.erro);
      lumiSays.errorOccurred();
      return;
    }
    // Verifica se é Vision
    if ('labels' in analisarResponse && 'web_entities' in analisarResponse) {
      setVisionResults(analisarResponse as VisionResponse);
    }
    // Verifica se é Gemini
    if ('objeto' in analisarResponse) {
      setGeminiResults([analisarResponse as GeminiResponse]);
    }
    
    lumiSays.imageAnalyzed();
  } catch (error) {
    console.error('Error processing image:', error);
    Alert.alert('Erro', 'Não foi possível processar a imagem. Verifique se o servidor está rodando');
    lumiSays.errorOccurred();
  } finally {
    setLoading(false);
  }
};

  const speakDescription = async () => {
    if (geminiResults.length > 0) {
      setIsSpeaking(true);
      lumiSays.speakButtonPressed();
      Speech.speak(geminiResults[0].objeto, {
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
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.selectedImage} 
              accessible={true}
              accessibilityLabel="Imagem selecionada para análise"
              accessibilityRole="image"
            />
          ) : (
            <View 
              style={styles.placeholderImage}
              accessible={true}
              accessibilityLabel="Área para seleção de imagem"
              accessibilityRole="button"
            >
              <Camera size={48} color="#A0AEC0" />
              <Text 
                style={styles.placeholderText}
                accessible={true}
                accessibilityLabel="Nenhuma imagem selecionada ainda"
              >
                Nenhuma imagem selecionada
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={takePhoto}
            accessible={true}
            accessibilityLabel="Tirar Foto"
            accessibilityRole="button"
            accessibilityHint="Abre a câmera para tirar uma nova foto"
          >
            <Camera size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={pickImage}
            accessible={true}
            accessibilityLabel="Selecionar da Galeria"
            accessibilityRole="button"
            accessibilityHint="Abre a galeria para escolher uma imagem existente"
          >
            <Upload size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View 
            style={styles.loadingContainer}
            accessible={true}
            accessibilityLabel="Processando imagem, aguarde"
            accessibilityRole="progressbar"
          >
            <ActivityIndicator size="large" color="#F7931E" />
            <Text 
              style={styles.loadingText}
              accessible={true}
              accessibilityLabel="Processando imagem, por favor aguarde"
            >
              Processando imagem...
            </Text>
          </View>
        )}

        {visionResults && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Objetos Detectados</Text>
            {visionResults.labels.map((label: any, index: number) => (
              <View key={index} style={styles.labelItem}>
                <Text style={styles.labelText}>{label.objeto}</Text>
                <Text style={styles.confidenceText}>{(label.confianca * 100).toFixed(0)}%</Text>
              </View>
            ))}

            {visionResults.web_entities.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Entidades Web</Text>
                {visionResults.web_entities.map((entity: any, index: number) => (
                  <View key={index} style={styles.labelItem}>
                    <Text style={styles.labelText}>{entity.descricao}</Text>
                    <Text style={styles.confidenceText}>{(entity.score * 100).toFixed(0)}%</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {geminiResults.length > 0 && (
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
            <Text style={styles.descriptionText}>
              {geminiResults.length > 0 ? geminiResults[0].objeto : ''}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Componente do Lumi Assistant */}
      {isLumiVisible && currentMessage && (
        <Lumi 
          message={currentMessage} 
          onMessageComplete={clearMessage}
        />
      )}
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