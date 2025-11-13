import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  Easing 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    scale.value = withSequence(
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }),
      withTiming(1.05, {
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
      }),
      withTiming(1, {
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    // Duração total: 3 segundos
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.in(Easing.cubic),
      });
      
      setTimeout(() => {
        onFinish();
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, animatedStyle]}>
        <Image
          source={require('../assets/images/logotipo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '85%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
