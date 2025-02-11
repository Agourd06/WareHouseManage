import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import ProductProvider from './context/ProductContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Hide splash screen after everything is set up
    SplashScreen.hideAsync();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ProductProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="product/[id]" 
            options={{ 
              presentation: 'card',
              headerTitle: 'Product Details'
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ProductProvider>
  );
}
