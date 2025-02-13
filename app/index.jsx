import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { warehousemanService } from '@/services/warehousemanService';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/app/context/UserContext';

const LoginScreen = () => {
  const [secretKey, setSecretKey] = useState('');
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogin = async () => {
    try {
      const user = await warehousemanService.validateSecretKey(secretKey);
      
      if (user) {
        setUser(user);
        Alert.alert('Succès', `Bienvenue ${user.name} !`);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erreur', 'Code secret incorrect');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Warehouse Manager</Text>
            <Text style={styles.subtitle}>Manage your inventory efficiently</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your secret key"
              placeholderTextColor="#94A3B8"
              value={secretKey}
              onChangeText={setSecretKey}
              secureTextEntry
            />
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
    transform: [{ scale: 1.1 }],
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#E2E8F0',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 24,
    padding: 32,
    backdropFilter: 'blur(10px)',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
