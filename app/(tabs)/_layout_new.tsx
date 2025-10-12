import { Tabs } from 'expo-router';
import { Camera, Volume2, FileText, Hand, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme, getFontSize } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 2,
          height: 80,
          paddingBottom: 12,
          paddingTop: 12,
          ...theme.shadows.large,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: getFontSize('caption'),
          fontWeight: '700',
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'VER',
          tabBarIcon: ({ size, color }) => (
            <Camera size={size + 4} color={color} strokeWidth={2.5} />
          ),
          tabBarAccessibilityLabel: 'Análise de Imagens',
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: 'OUVIR',
          tabBarIcon: ({ size, color }) => (
            <Volume2 size={size + 4} color={color} strokeWidth={2.5} />
          ),
          tabBarAccessibilityLabel: 'Funções de Áudio',
        }}
      />
      <Tabs.Screen
        name="file"
        options={{
          title: 'LER',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size + 4} color={color} strokeWidth={2.5} />
          ),
          tabBarAccessibilityLabel: 'Ler Documentos',
        }}
      />
      <Tabs.Screen
        name="libras"
        options={{
          title: 'LIBRAS',
          tabBarIcon: ({ size, color }) => (
            <Hand size={size + 4} color={color} strokeWidth={2.5} />
          ),
          tabBarAccessibilityLabel: 'Língua de Sinais',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'AJUSTES',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size + 4} color={color} strokeWidth={2.5} />
          ),
          tabBarAccessibilityLabel: 'Configurações',
        }}
      />
    </Tabs>
  );
}
