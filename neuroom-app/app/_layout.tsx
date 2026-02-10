import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../contexts/AppContext';
import { Colors } from '../constants/colors';
import { initAnalytics } from '../utils/analytics';

export default function RootLayout() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="assignment/[id]"
          options={{ title: 'Задание', headerBackTitle: 'Назад' }}
        />
        <Stack.Screen
          name="feedback/[id]"
          options={{ title: 'Обратная связь', headerBackTitle: 'Назад' }}
        />
        <Stack.Screen
          name="tutor/[id]"
          options={{ title: 'AI-репетитор', headerBackTitle: 'Назад' }}
        />
        <Stack.Screen
          name="quiz/[id]"
          options={{ title: 'Квиз', headerBackTitle: 'Назад', headerShown: false }}
        />
        <Stack.Screen
          name="parent-review/[token]"
          options={{ title: 'Проверка задания', headerShown: false }}
        />
      </Stack>
    </AppProvider>
  );
}
