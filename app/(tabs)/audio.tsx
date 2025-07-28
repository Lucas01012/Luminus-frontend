import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { Mic, Play, Pause, Square, Upload, Volume2 } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Speech from 'expo-speech';

export default function AudioScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording - in real app, use expo-av
    setTimeout(() => {
      setIsRecording(false);
      Alert.alert('Gravação', 'Gravação de áudio concluída!');
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const playAudio = () => {
    setIsPlaying(true);
    // Simulate playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const pauseAudio = () => {
    setIsPlaying(false);
  };

  const selectAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
        Alert.alert('Arquivo Selecionado', `${result.assets[0].name} foi carregado com sucesso!`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo de áudio');
    }
  };

  const speakSampleText = () => {
    const sampleText = "Este é um exemplo de conversão de texto para fala usando a funcionalidade de áudio do aplicativo";
    
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      Speech.speak(sampleText, {
        language: 'pt-BR',
        rate: 0.8,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
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
        <Text style={styles.headerTitle}>ÁUDIO</Text>
        <Text style={styles.headerSubtitle}>Gravação e Reprodução</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recording Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gravação de Áudio</Text>
          <View style={styles.recordingContainer}>
            <TouchableOpacity 
              style={[styles.recordButton, isRecording && styles.recordingActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? (
                <Square size={32} color="#FFFFFF" />
              ) : (
                <Mic size={32} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <Text style={styles.recordingText}>
              {isRecording ? 'Gravando... Toque para parar' : 'Toque para gravar'}
            </Text>
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Controles de Reprodução</Text>
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={isPlaying ? pauseAudio : playAudio}
            >
              {isPlaying ? (
                <Pause size={24} color="#FFFFFF" />
              ) : (
                <Play size={24} color="#FFFFFF" />
              )}
              <Text style={styles.controlButtonText}>
                {isPlaying ? 'Pausar' : 'Reproduzir'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* File Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Arquivo de Áudio</Text>
          <TouchableOpacity style={styles.fileButton} onPress={selectAudioFile}>
            <Upload size={20} color="#FFFFFF" />
            <Text style={styles.fileButtonText}>Escolher Arquivo</Text>
          </TouchableOpacity>
          
          {selectedFile && (
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{selectedFile.name}</Text>
              <Text style={styles.fileSize}>
                Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          )}
        </View>

        {/* Text to Speech */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Texto para Fala</Text>
          <TouchableOpacity 
            style={[styles.speakButton, isSpeaking && styles.speakingActive]}
            onPress={speakSampleText}
          >
            <Volume2 size={20} color="#FFFFFF" />
            <Text style={styles.speakButtonText}>
              {isSpeaking ? 'Parar Fala' : 'Falar Texto de Exemplo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Audio Features */}
        <View style={styles.featuresContainer}>
          
          <View style={styles.featureItem}>
            <Mic size={20} color="#EF4444" />
            <Text style={styles.featureText}>Gravação de áudio em tempo real</Text>
          </View>
          <View style={styles.featureItem}>
            <Play size={20} color="#EF4444" />
            <Text style={styles.featureText}>Reprodução de arquivos de áudio</Text>
          </View>
          <View style={styles.featureItem}>
            <Volume2 size={20} color="#EF4444" />
            <Text style={styles.featureText}>Conversão de texto para fala</Text>
          </View>
          <View style={styles.featureItem}>
            <Upload size={20} color="#EF4444" />
            <Text style={styles.featureText}>Upload de arquivos de áudio</Text>
          </View>
        </View>
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
    color: '#EF4444',
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  recordingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    backgroundColor: '#EF4444',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingActive: {
    backgroundColor: '#DC2626',
  },
  recordingText: {
    color: '#A0AEC0',
    fontSize: 16,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: '#4A5568',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  fileButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    backgroundColor: '#4A5568',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
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
  },
  speakButton: {
    backgroundColor: '#4ECDC4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  speakingActive: {
    backgroundColor: '#38B2AC',
  },
  speakButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
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
});