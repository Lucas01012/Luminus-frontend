import { Tabs } from 'expo-router';
import { FileText, Hand, Volume2, FolderOpen, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A1A', // Fundo mais escuro para melhor contraste
          borderTopColor: '#FFB800', // Borda amarela para destaque
          borderTopWidth: 2,
          height: 90, // Maior para facilitar toque
          paddingBottom: 15,
          paddingTop: 15,
          // Sombra para melhor definição
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: '#FFB800', // Amarelo para melhor visibilidade
        tabBarInactiveTintColor: '#B0B0B0', // Cinza mais claro
        tabBarLabelStyle: {
          fontSize: 14, // Maior para melhor legibilidade
          fontWeight: '700', // Mais pesado
          letterSpacing: 0.5, // Espaçamento para clareza
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        // Área de toque maior
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'IMAGEM',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size + 4} color={color} />
          ),
          tabBarAccessibilityLabel: 'Análise de Imagens',
        }}
      />
      <Tabs.Screen
        name="libras"
        options={{
          title: 'LIBRAS',
          tabBarIcon: ({ size, color }) => (
            <Hand size={size + 4} color={color} />
          ),
          tabBarAccessibilityLabel: 'Tradução para LIBRAS',
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: 'ÁUDIO',
          tabBarIcon: ({ size, color }) => (
            <Volume2 size={size + 4} color={color} />
          ),
          tabBarAccessibilityLabel: 'Funções de Áudio',
        }}
      />
      <Tabs.Screen
        name="file"
        options={{
          title: 'ARQUIVO',
          tabBarIcon: ({ size, color }) => (
            <FolderOpen size={size + 4} color={color} />
          ),
          tabBarAccessibilityLabel: 'Processamento de Documentos',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'CONFIG',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size + 4} color={color} />
          ),
          tabBarAccessibilityLabel: 'Configurações de Acessibilidade',
        }}
      />
    </Tabs>
  );
}