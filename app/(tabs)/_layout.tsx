import { Tabs } from 'expo-router';
import { FileText, Hand, Volume2, FolderOpen } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2D3748',
          borderTopColor: '#4A5568',
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#F7931E',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'TEXTO',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="libras"
        options={{
          title: 'LIBRAS',
          tabBarIcon: ({ size, color }) => (
            <Hand size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: 'ÁUDIO',
          tabBarIcon: ({ size, color }) => (
            <Volume2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="file"
        options={{
          title: 'ARQUIVO',
          tabBarIcon: ({ size, color }) => (
            <FolderOpen size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}