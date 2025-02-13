import { Stack } from 'expo-router';
import ProductProvider from './context/ProductContext';
import { UserProvider } from './context/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
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
    </UserProvider>
  );
} 