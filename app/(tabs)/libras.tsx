import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { Hand, Play, Camera } from 'lucide-react-native';

export default function LibrasScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🌞</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>LIBRAS</Text>
        <Text style={styles.headerSubtitle}>Tradução para Língua de Sinais</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.comingSoonContainer}>
          <Hand size={80} color="#4ECDC4" />
          <Text style={styles.comingSoonTitle}>Em Breve!</Text>
          <Text style={styles.comingSoonText}>
            Esta funcionalidade permitirá traduzir texto e imagens para LIBRAS (Língua Brasileira de Sinais).
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Funcionalidades Planejadas:</Text>
          
          <View style={styles.featureItem}>
            <Camera size={24} color="#4ECDC4" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Tradução de Imagens</Text>
              <Text style={styles.featureDescription}>
                Capture uma imagem e receba a tradução em LIBRAS
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Play size={24} color="#4ECDC4" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Vídeos em LIBRAS</Text>
              <Text style={styles.featureDescription}>
                Visualize traduções através de vídeos demonstrativos
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Hand size={24} color="#4ECDC4" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Dicionário LIBRAS</Text>
              <Text style={styles.featureDescription}>
                Acesse um dicionário completo de sinais
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.notifyButton}>
          <Text style={styles.notifyButtonText}>Notificar quando disponível</Text>
        </TouchableOpacity>
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
    color: '#4ECDC4',
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
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    marginBottom: 30,
  },
  comingSoonTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    backgroundColor: '#4A5568',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#A0AEC0',
    lineHeight: 20,
  },
  notifyButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 40,
  },
  notifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});