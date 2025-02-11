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

const LoginScreen = () => {
  const [secretKey, setSecretKey] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://192.168.8.107:3000/warehousemans');
      const warehousemans = response.data;
      console.log('test' ,warehousemans);
      const user = warehousemans.find(w => w.secretKey === secretKey);

      if (user) {
        Alert.alert('Succès', `Bienvenue ${user.name} !`);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erreur', 'Code secret incorrect');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Image
            source={require('../assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Gestion de Stock</Text>
            <Text style={styles.subtitle}>
              Simplifiez votre gestion d'inventaire
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Code d'accès magasinier</Text>
            <TextInput
              value={secretKey}
              onChangeText={setSecretKey}
              placeholder="Entrez votre code secret"
              secureTextEntry
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Se Connecter</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Application de Gestion de Stock v1.0
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 320,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: '#1a237e',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    color: '#666',
    fontSize: 12,
  },
});

export default LoginScreen;
