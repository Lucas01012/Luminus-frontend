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
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { historyService } from '@/src/services/historyService';
import { HistoryItem } from '@/src/models';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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
              <Image
                source={{ uri: item.imageUri }}
                style={[styles.contentImage, { borderColor: theme.colors.outline }]}
                resizeMode="cover"
              />
            )}
            <ScrollView style={styles.contentScroll} nestedScrollEnabled>
              <Text style={[styles.contentText, { color: theme.colors.text }]}>
                {item.content}
              </Text>
            </ScrollView>
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
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
              onPress={() => handleDelete(item)}
              accessibilityLabel="Excluir item do histórico"
            >
              <FontAwesome name="trash" size={18} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

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
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.colors.surface }]}>
              <FontAwesome name="inbox" size={64} color={theme.colors.textDisabled} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              {searchQuery ? 'Nenhum resultado' : 'Histórico vazio'}
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {searchQuery
                ? 'Não encontramos itens que correspondam à sua busca'
                : 'Suas análises de imagens e documentos aparecerão aqui'}
            </Text>
          </View>
        ) : (
          history.map(renderHistoryItem)
        )}
      </ScrollView>
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
  contentScroll: {
    maxHeight: 300,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
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
});
