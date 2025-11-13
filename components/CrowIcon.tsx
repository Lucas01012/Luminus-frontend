import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageStyle } from 'react-native';

interface CrowIconProps {
  size?: number;
  style?: ViewStyle;
  rounded?: boolean;
  backgroundColor?: string;
}

export default function CrowIcon({ 
  size = 24, 
  style, 
  rounded = true,
  backgroundColor = '#F1F8FF' 
}: CrowIconProps) {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: rounded ? size / 2 : 0,
    backgroundColor: rounded ? backgroundColor : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: rounded ? size * 0.15 : 0, // 15% de padding quando arredondado
  };

  return (
    <View style={[containerStyle, style]}>
      <Image
        source={require('../assets/images/logotipo.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
