import React, { useState } from 'react';
import { StyleSheet, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText as Text } from '@/components/ThemedText';
import { ThemedView as View } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { productService } from '@/services/productService';
import Scanner from '@/components/Scanner';
import { useProducts } from '@/app/context/ProductContext';

export default function AddProductScreen() {
  const router = useRouter();
  const { refreshProducts } = useProducts();
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    barcode: '',
    supplier: '',
  });

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.price) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      const newProduct = {
        ...formData,
        price: Number(formData.price),
        type: 'product',
        barcode: formData.barcode || '',
        supplier: formData.supplier || '',
        stocks: [], // Empty stocks array
        editedBy: []
      };

      await productService.createProduct(newProduct);
      await refreshProducts();
      Alert.alert('Success', 'Product added successfully', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)')
        }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  const handleBarcodeScan = (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setShowScanner(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <Text style={styles.headerSubtitle}>Fill in the product details below</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name *</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome name="cube" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price *</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome name="dollar" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              keyboardType="decimal-pad"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Supplier</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome name="truck" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter supplier name"
              value={formData.supplier}
              onChangeText={(text) => setFormData({ ...formData, supplier: text })}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL</Text>
          <View style={styles.inputWrapper}>
            <FontAwesome name="image" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={formData.image}
              onChangeText={(text) => setFormData({ ...formData, image: text })}
            />
          </View>
        </View>

        <View style={styles.barcodeSection}>
          <TextInput
            style={styles.input}
            value={formData.barcode}
            onChangeText={(text) => setFormData(prev => ({ ...prev, barcode: text }))}
            placeholder="Enter barcode"
          />
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => setShowScanner(true)}
          >
            <FontAwesome name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <FontAwesome name="plus" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.submitButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {showScanner && (
        <Scanner 
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  form: {
    padding: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  barcodeSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  scanButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 