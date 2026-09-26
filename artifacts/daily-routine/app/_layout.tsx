import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppProvider } from '@/lib/AppContext';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldPlaySound: false, shouldSetBadge: false, shouldShowBanner: true, shouldShowList: true }) });
const queryClient = new QueryClient();

function RootLayoutNav() { return <Stack screenOptions={{ headerBackTitle: 'Back' }}><Stack.Screen name="(tabs)" options={{ headerShown: false }} /></Stack>; }

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  useEffect(() => { if (fontsLoaded || fontError) SplashScreen.hideAsync(); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return null;
  return <SafeAreaProvider><QueryClientProvider client={queryClient}><AppProvider><ErrorBoundary><GestureHandlerRootView style={{ flex: 1 }}><KeyboardProvider><RootLayoutNav /></KeyboardProvider></GestureHandlerRootView></ErrorBoundary></AppProvider></QueryClientProvider></SafeAreaProvider>;
}
