import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useFeedback, FeedbackType } from '@/src/hooks';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { theme } = useTheme();
  const { triggerFeedback } = useFeedback();

  const handleTabPress = async () => {
    await triggerFeedback(FeedbackType.LIGHT);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 32 : 8,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.outline,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.bold,
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "home" : "home"} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'Tela inicial do Luminus',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Câmera',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "camera" : "camera"} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'Abrir câmera para capturar e analisar imagens',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Galeria',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "photo" : "photo"} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'Selecionar imagens da galeria',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documentos',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "file-text" : "file-text-o"} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'Processar documentos PDF e DOCX',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      
      <Tabs.Screen
        name="two"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "history" : "history"} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'Histórico de análises e documentos',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? "cog" : "cog"} 
              color={color} 
            />
          ),
          tabBarAccessibilityLabel: 'Configurações do aplicativo',
        }}
        listeners={{
          tabPress: handleTabPress,
        }}
      />
    </Tabs>
  );
}
