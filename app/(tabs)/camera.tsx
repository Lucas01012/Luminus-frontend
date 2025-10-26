
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { useTheme } from '@/src/theme/ThemeProvider';
import { Button } from '@/src/components/ui';
import { useFeedback, FeedbackType } from '@/src/hooks/useFeedback';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();
  
  const [permission, requestPermission] = useCameraPermissions();

  const [type, setType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [isReady, setIsReady] = useState(false);
  const cameraRef = useRef<any>(null);


  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);


  const takePicture = async () => {
    try {
      await triggerFeedback(FeedbackType.MEDIUM);
      if (cameraRef.current && isReady && cameraRef.current.takePictureAsync) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        router.push({
          pathname: '/results',
          params: { imageUri: photo.uri, type: 'camera' }
        });
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      Alert.alert('Erro', 'Não foi possível capturar a foto.');
    }
  };


  const toggleCameraType = async () => {
    await triggerFeedback(FeedbackType.LIGHT);
    setType(current => (current === 'back' ? 'front' : 'back'));
  };


  const toggleFlash = async () => {
    await triggerFeedback(FeedbackType.LIGHT);
    setFlashMode(current => {
      switch (current) {
        case 'off': return 'on';
        case 'on': return 'auto';
        case 'auto': return 'off';
        default: return 'off';
      }
    });
  };

  const goBack = async () => {
    await triggerFeedback(FeedbackType.LIGHT);
    router.back();
  };


  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <Text style={[styles.message, { color: theme.colors.text }]}> 
          Solicitando permissão da câmera...
        </Text>
      </View>
    );
  }

  if (permission.status !== 'granted') {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <Text style={[styles.message, { color: theme.colors.text }]}> 
          Acesso à câmera negado. Permita o acesso nas configurações.
        </Text>
        <Button
          title="Permitir Câmera"
          onPress={requestPermission}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={type}
          flash={flashMode}
          onCameraReady={() => setIsReady(true)}
          ratio={Platform.OS === 'ios' ? '16:9' : '4:3'}
        />

        {/* Controles da câmera */}
        <View style={styles.controls}>
          {/* Botão de voltar */}
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.overlay }]}
            onPress={goBack}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <FontAwesome name="arrow-left" size={20} color={theme.colors.textInverse} />
          </TouchableOpacity>

          {/* Botão de flash */}
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.overlay }]}
            onPress={toggleFlash}
            accessibilityLabel={`Flash: ${flashMode}`}
            accessibilityRole="button"
          >
            <FontAwesome 
              name={flashMode === 'on' ? 'flash' : flashMode === 'auto' ? 'magic' : 'flash'} 
              size={20} 
              color={flashMode === 'off' ? theme.colors.textSecondary : theme.colors.warning} 
            />
          </TouchableOpacity>
        </View>

        {/* Botões inferiores */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.surface }]}
            onPress={toggleCameraType}
            accessibilityLabel="Alternar câmera"
            accessibilityRole="button"
          >
            <FontAwesome name="refresh" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          {/* Botão de captura */}
          <TouchableOpacity
            style={[styles.captureButton, { borderColor: theme.colors.primary }]}
            onPress={takePicture}
            accessibilityLabel="Capturar foto"
            accessibilityRole="button"
            accessibilityHint="Toque para tirar uma foto e analisá-la"
          >
            <View style={[styles.captureButtonInner, { backgroundColor: theme.colors.primary }]} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push('/(tabs)/gallery')}
            accessibilityLabel="Abrir galeria"
            accessibilityRole="button"
          >
            <FontAwesome name="photo" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  placeholderSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    padding: 32,
  },
  controls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  secondaryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});