import { Stack } from 'expo-router';
import ProductProvider from './context/ProductContext';

export default function RootLayout() {
  return (
    <ProductProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="product/[id]" 
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: 'Product Details'
          }} 
        />
      </Stack>
    </ProductProvider>
  );
} 