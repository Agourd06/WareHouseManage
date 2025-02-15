import { Stack } from 'expo-router';
import ProductProvider from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <UserProvider>
      <ProductProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
        </ProductProvider>
    </UserProvider>
  );
} 