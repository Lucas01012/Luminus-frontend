import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Share,
  Modal,
  Dimensions,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useTheme } from '@/src/theme/ThemeProvider';
import { historyService } from '@/src/services/historyService';
import { HistoryItem } from '@/src/models';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import { useSpeech } from '@/src/hooks/useSpeech';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'documents' | 'images' | null>(null);
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  
  const { speak, stop, isSpeaking } = useSpeech({ autoStop: true });

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = searchQuery
        ? await historyService.searchHistory(searchQuery)
        : await historyService.getHistory();
      setHistory(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [searchQuery])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleSpeak = async (item: HistoryItem) => {
    if (isSpeaking && speakingItemId === item.id) {
      // Se já está falando este item, para
      await stop();
      setSpeakingItemId(null);
    } else {
      // Para qualquer fala anterior e inicia nova
      await stop();
      setSpeakingItemId(item.id);
      
      // Lê apenas o conteúdo, sem o título
      const textToSpeak = item.content;
      
      try {
        await speak(textToSpeak);
      } catch (error) {
        console.error('Erro ao falar:', error);
      } finally {
        setSpeakingItemId(null);
      }
    }
  };

  const handleShare = async (item: HistoryItem) => {
    try {
      let message = `📱 Luminus - Assistente Visual Inteligente\n\n`;
      message += `📌 ${item.title}\n\n`;
      message += `${item.content}\n\n`;
      
      if (item.metadata?.keywords && item.metadata.keywords.length > 0) {
        message += `🔑 Palavras-chave: ${item.metadata.keywords.join(', ')}\n\n`;
      }
      
      if (item.metadata?.pages) {
        message += `📄 Páginas: ${item.metadata.pages}\n\n`;
      }
      
      message += `📅 ${formatDate(item.timestamp)}\n`;
      message += `✨ Gerado pelo Luminus`;

      // Se for uma imagem, compartilha imagem + análise juntos
      if (item.type === 'image' && item.imageUri) {
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          try {
            // Cria um arquivo temporário com o texto da análise
            const textFileName = `${FileSystem.cacheDirectory}luminus_analise_${Date.now()}.txt`;
            await FileSystem.writeAsStringAsync(textFileName, message, {
              encoding: FileSystem.EncodingType.UTF8,
            });

            // Compartilha a imagem com o arquivo de texto
            // Nota: Nem todos os apps suportam múltiplos arquivos, mas WhatsApp suporta
            await Sharing.shareAsync(item.imageUri, {
              mimeType: 'image/jpeg',
              dialogTitle: `Compartilhar - ${item.title}`,
              UTI: 'public.jpeg',
            });

            // Limpa o arquivo temporário após compartilhar
            try {
              await FileSystem.deleteAsync(textFileName, { idempotent: true });
            } catch (cleanupError) {
              // Ignora erros de limpeza
            }
          } catch (sharingError) {
            // Fallback: usa Share.share com URL da imagem + mensagem
            await Share.share({
              message: message,
              url: item.imageUri,
              title: `Luminus - ${item.title}`,
            });
          }
        } else {
          // Fallback: Share.share com imagem + texto
          await Share.share({
            message: message,
            url: item.imageUri,
            title: `Luminus - ${item.title}`,
          });
        }
      } else {
        // Para documentos: apenas texto
        await Share.share({
          message: message,
          title: `Luminus - ${item.title}`,
        });
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o item.');
    }
  };

  const handleDelete = (item: HistoryItem) => {
    Alert.alert(
      'Confirmar exclusão',
      'Deseja realmente excluir este item do histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await historyService.deleteItem(item.id, item.type);
              await loadHistory();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o item');
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const renderHistoryItem = (item: HistoryItem) => {
    const isExpanded = expandedId === item.id;
    const isThisItemSpeaking = isSpeaking && speakingItemId === item.id;
    const typeIcon = item.type === 'image' ? 'image' : 'file-text';
    const typeColor = item.type === 'image' ? theme.colors.info : theme.colors.secondary;

    return (
      <View key={item.id} style={[styles.itemContainer, { backgroundColor: theme.colors.backgroundCard, borderColor: theme.colors.outline }]}>
        <TouchableOpacity
          style={styles.itemHeader}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          accessibilityLabel={`${item.title}, ${formatDate(item.timestamp)}, toque para ${isExpanded ? 'recolher' : 'expandir'}`}
        >
          <View style={styles.itemHeaderContent}>
            {/* Miniatura da imagem (se disponível) ou ícone do tipo */}
            {!isExpanded && item.type === 'image' && item.imageUri ? (
              <Image
                source={{ uri: item.imageUri }}
                style={[styles.thumbnailImage, { borderColor: theme.colors.outline }]}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.typeIcon, { backgroundColor: typeColor }]}>
                <FontAwesome name={typeIcon} size={20} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.itemDate, { color: theme.colors.textSecondary }]}>
                {formatDate(item.timestamp)}
              </Text>
              {item.metadata && (
                <View style={styles.metadataRow}>
                  {item.metadata.pages && (
                    <Text style={[styles.metadataText, { color: theme.colors.textSecondary }]}>
                      {item.metadata.pages} páginas
                    </Text>
                  )}
                  {item.metadata.confidence && (
                    <Text style={[styles.metadataText, { color: theme.colors.textSecondary }]}>
                      {(item.metadata.confidence * 100).toFixed(0)}% confiança
                    </Text>
                  )}
                  {item.metadata.processingTime && (
                    <Text style={[styles.metadataText, { color: theme.colors.textSecondary }]}>
                      ⚡ {item.metadata.processingTime.toFixed(1)}s
                    </Text>
                  )}
                </View>
              )}
            </View>
            <FontAwesome
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={[styles.itemContent, { borderTopColor: theme.colors.outline }]}>
            {item.imageUri && (
              <TouchableOpacity
                onPress={() => setFullscreenImage(item.imageUri!)}
                activeOpacity={0.9}
                accessibilityLabel="Abrir imagem em tela cheia"
              >
                <Image
                  source={{ uri: item.imageUri }}
                  style={[styles.contentImage, { borderColor: theme.colors.outline }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            <View style={styles.contentTextContainer}>
              <Text style={[styles.contentText, { color: theme.colors.text }]}>
                {item.content}
              </Text>
            </View>
            {item.metadata?.keywords && item.metadata.keywords.length > 0 && (
              <View style={styles.keywordsContainer}>
                <Text style={[styles.keywordsLabel, { color: theme.colors.textSecondary }]}>
                  Palavras-chave:
                </Text>
                <View style={styles.keywordsList}>
                  {item.metadata.keywords.map((keyword, index) => (
                    <View key={index} style={[styles.keywordTag, { backgroundColor: theme.colors.primaryLight + '20', borderColor: theme.colors.primary }]}>
                      <Text style={[styles.keywordText, { color: theme.colors.primary }]}>
                        {keyword}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Botões de ação */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.speakButton, { 
                  backgroundColor: isThisItemSpeaking ? theme.colors.warning : theme.colors.primary 
                }]}
                onPress={() => handleSpeak(item)}
                accessibilityLabel={isThisItemSpeaking ? "Parar leitura" : "Ler em voz alta"}
              >
                <FontAwesome 
                  name={isThisItemSpeaking ? "stop" : "volume-up"} 
                  size={16} 
                  color="#FFFFFF" 
                />
                <Text style={styles.actionButtonText}>
                  {isThisItemSpeaking ? "Parar" : "Ouvir"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                onPress={() => handleShare(item)}
                accessibilityLabel="Compartilhar item"
              >
                <FontAwesome name="share-alt" size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Compartilhar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton, { backgroundColor: theme.colors.error }]}
                onPress={() => handleDelete(item)}
                accessibilityLabel="Excluir item do histórico"
              >
                <FontAwesome name="trash" size={16} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  // Filtra histórico por categoria e busca
  const filteredHistory = history.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || 
      (activeCategory === 'documents' && item.type === 'document') ||
      (activeCategory === 'images' && item.type === 'image');
    
    return matchesSearch && matchesCategory;
  });

  const documentsCount = history.filter(item => item.type === 'document').length;
  const imagesCount = history.filter(item => item.type === 'image').length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.backgroundCard, borderBottomColor: theme.colors.outline }]}>
        <View style={styles.headerTop}>
          <View style={[styles.headerIconContainer, { backgroundColor: theme.colors.primary }]}>
            <FontAwesome name="history" size={36} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              Histórico
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              {history.length} {history.length === 1 ? 'item' : 'itens'}
            </Text>
          </View>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
          <FontAwesome name="search" size={18} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Buscar no histórico..."
            placeholderTextColor={theme.colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Campo de busca no histórico"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Limpar busca">
              <FontAwesome name="times-circle" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Cards de Categoria */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryCard,
              { 
                backgroundColor: activeCategory === 'documents' ? theme.colors.secondary : theme.colors.surface,
                borderColor: activeCategory === 'documents' ? theme.colors.secondary : theme.colors.outline
              }
            ]}
            onPress={() => setActiveCategory(activeCategory === 'documents' ? null : 'documents')}
            accessibilityLabel={`Filtrar por documentos, ${documentsCount} itens`}
          >
            <View style={[
              styles.categoryIconContainer,
              { backgroundColor: activeCategory === 'documents' ? '#FFFFFF' : theme.colors.secondary }
            ]}>
              <FontAwesome 
                name="file-text" 
                size={20} 
                color={activeCategory === 'documents' ? theme.colors.secondary : '#FFFFFF'} 
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={[
                styles.categoryTitle,
                { color: activeCategory === 'documents' ? '#FFFFFF' : theme.colors.text }
              ]}>
                Documentos
              </Text>
              <Text style={[
                styles.categoryCount,
                { color: activeCategory === 'documents' ? '#FFFFFF' : theme.colors.textSecondary }
              ]}>
                {documentsCount} {documentsCount === 1 ? 'item' : 'itens'}
              </Text>
            </View>
            {activeCategory === 'documents' && (
              <FontAwesome name="check-circle" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryCard,
              { 
                backgroundColor: activeCategory === 'images' ? theme.colors.info : theme.colors.surface,
                borderColor: activeCategory === 'images' ? theme.colors.info : theme.colors.outline
              }
            ]}
            onPress={() => setActiveCategory(activeCategory === 'images' ? null : 'images')}
            accessibilityLabel={`Filtrar por imagens, ${imagesCount} itens`}
          >
            <View style={[
              styles.categoryIconContainer,
              { backgroundColor: activeCategory === 'images' ? '#FFFFFF' : theme.colors.info }
            ]}>
              <FontAwesome 
                name="image" 
                size={20} 
                color={activeCategory === 'images' ? theme.colors.info : '#FFFFFF'} 
              />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={[
                styles.categoryTitle,
                { color: activeCategory === 'images' ? '#FFFFFF' : theme.colors.text }
              ]}>
                Imagens
              </Text>
              <Text style={[
                styles.categoryCount,
                { color: activeCategory === 'images' ? '#FFFFFF' : theme.colors.textSecondary }
              ]}>
                {imagesCount} {imagesCount === 1 ? 'item' : 'itens'}
              </Text>
            </View>
            {activeCategory === 'images' && (
              <FontAwesome name="check-circle" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {activeCategory && (
          <TouchableOpacity
            style={[styles.clearFilterButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}
            onPress={() => setActiveCategory(null)}
          >
            <FontAwesome name="times" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.clearFilterText, { color: theme.colors.textSecondary }]}>
              Limpar filtro
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary, marginTop: 16 }]}>
              Carregando histórico...
            </Text>
          </View>
        ) : filteredHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.colors.surface }]}>
              <FontAwesome name="inbox" size={64} color={theme.colors.textDisabled} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              {searchQuery || activeCategory ? 'Nenhum resultado' : 'Histórico vazio'}
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {searchQuery || activeCategory
                ? 'Não encontramos itens que correspondam aos filtros'
                : 'Suas análises de imagens e documentos aparecerão aqui'}
            </Text>
          </View>
        ) : (
          filteredHistory.map(renderHistoryItem)
        )}
      </ScrollView>

      {/* Modal de imagem em tela cheia */}
      <Modal
        visible={!!fullscreenImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullscreenImage(null)}
      >
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.fullscreenCloseButton}
            onPress={() => setFullscreenImage(null)}
            accessibilityLabel="Fechar visualização"
          >
            <FontAwesome name="times" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          
          {fullscreenImage && (
            <Image
              source={{ uri: fullscreenImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    padding: 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  categoryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    gap: 10,
    minHeight: 80,
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryInfo: {
    flex: 1,
    minWidth: 0,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
    flexWrap: 'nowrap',
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  itemContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  itemHeader: {
    padding: 16,
  },
  itemHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thumbnailImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 15,
    marginBottom: 4,
  },
  metadataRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metadataText: {
    fontSize: 15,
  },
  itemContent: {
    padding: 16,
    borderTopWidth: 1,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  contentTextContainer: {
    marginBottom: 16,
  },
  contentText: {
    fontSize: 17,
    lineHeight: 26,
  },
  keywordsContainer: {
    marginBottom: 16,
  },
  keywordsLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  keywordText: {
    fontSize: 15,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
    minHeight: 48,
  },
  speakButton: {
    // Cor definida dinamicamente
  },
  deleteButton: {
    // Cor definida dinamicamente
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
