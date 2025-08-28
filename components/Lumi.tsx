import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import * as Speech from 'expo-speech';

interface LumiProps {
  message?: string;
  isVisible?: boolean;
  position?: 'top-right' | 'floating';
  onMessageComplete?: () => void;
}

export default function Lumi({ 
  message = '', 
  isVisible = true, 
  position = 'top-right',
  onMessageComplete 
}: LumiProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [wingAnimation] = useState(new Animated.Value(0));
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Animação das asas (bater asas constantemente)
  useEffect(() => {
    const wingFlap = Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );
    wingFlap.start();
  }, []);

  // Animação de entrada/saída
  useEffect(() => {
    if (isVisible) {
      Animated.spring(animatedValue, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  // Mostra mensagem quando há uma nova
  useEffect(() => {
    if (message) {
      setShowMessage(true);
      speak(message);
      // Esconde a mensagem após 4 segundos
      setTimeout(() => {
        setShowMessage(false);
        onMessageComplete?.();
      }, 4000);
    }
  }, [message]);

  const speak = (text: string) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'pt-BR',
      rate: 0.9,
      pitch: 1.1, // Tom ligeiramente mais agudo para o corvo
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handlePress = () => {
    const greetings = [
      "Olá! Eu sou o Lumi, seu assistente pessoal!",
      "Precisa de ajuda? Estou aqui para te guiar!",
      "Que tal explorarmos as funcionalidades juntos?",
      "Dica: Você pode usar os recursos de acessibilidade do seu dispositivo comigo!"
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    speak(randomGreeting);
  };

  if (!isVisible) return null;

  const wingRotation = wingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-20deg'],
  });

  const bounceAnimation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top-right' ? styles.topRight : styles.floating,
        {
          transform: [
            { scale: bounceAnimation },
            { translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })}
          ],
          opacity: animatedValue,
        },
      ]}
    >
      {/* Balão de fala */}
      {showMessage && (
        <Animated.View style={[styles.speechBubble, { opacity: animatedValue }]}>
          <Text style={styles.speechText}>{message}</Text>
          <View style={styles.speechTail} />
        </Animated.View>
      )}

      {/* Corpo do Lumi */}
      <TouchableOpacity
        onPress={handlePress}
        style={styles.lumiContainer}
        accessible={true}
        accessibilityLabel="Lumi, seu assistente pessoal"
        accessibilityRole="button"
        accessibilityHint="Toque para interagir com o assistente Lumi"
      >
        {/* Imagem do Corvo com animação das asas */}
        <Animated.View
          style={[
            styles.ravenContainer,
            { 
              transform: [
                { rotate: wingRotation },
                { scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.1],
                })}
              ]
            },
          ]}
        >
          <Image
            source={require('../assets/images/raven.png')}
            style={[
              styles.ravenImage,
              isSpeaking && styles.ravenSpeaking
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  topRight: {
    top: 100,
    right: 20,
  },
  floating: {
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    maxWidth: 200,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  speechText: {
    fontSize: 14,
    color: '#2D3748',
    textAlign: 'center',
    fontWeight: '500',
  },
  speechTail: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  lumiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ravenContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ravenImage: {
    width: 80,
    height: 80,
  },
  ravenSpeaking: {
    opacity: 0.8,
  },
});
