import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useApp } from '../../contexts/AppContext';
import { Platform } from 'react-native';

const tabBarOptions = {
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: Colors.textTertiary,
  tabBarStyle: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.borderLight,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
  },
  tabBarLabelStyle: { fontSize: 11, fontWeight: '600' as const },
  headerStyle: { backgroundColor: Colors.background },
  headerTitleStyle: { fontWeight: '700' as const, color: Colors.text },
  headerShadowVisible: false,
};

export default function TabLayout() {
  const { state } = useApp();
  const isParent = state.mode === 'parent';

  return (
    <Tabs screenOptions={tabBarOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: isParent ? 'Задания ребёнка' : 'Главная',
          href: isParent ? null : '/(tabs)/',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="past"
        options={{
          title: 'Прошлые ДЗ',
          href: isParent ? null : '/(tabs)/past',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Достижения',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="grades"
        options={{
          title: isParent ? 'Журнал оценок' : 'Оценки',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={isParent ? 'school-outline' : 'stats-chart-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
