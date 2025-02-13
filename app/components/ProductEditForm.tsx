import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Product } from '../types/product';

interface EditFormData {
  name: string;
  price: string;
  supplier: string;
  image: string;
  barcode: string;
}

interface ProductEditFormProps {
  product: Product;
  editForm: EditFormData;
  setEditForm: (value: EditFormData | ((prev: EditFormData) => EditFormData)) => void;
  onCancel: () => void;
  onUpdate: () => void;
}

export function ProductEditForm({ 
  editForm, 
  setEditForm, 
  onCancel, 
  onUpdate 
}: ProductEditFormProps) {
  return (
    <ThemedView style={styles.editForm}>
      <ThemedText style={styles.sectionTitle}>Edit Product</ThemedText>

      <TextInput
        style={styles.input}
        value={editForm.name}
        onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
        placeholder="Product Name"
        blurOnSubmit={false}
      />

      <TextInput
        style={styles.input}
        value={editForm.price}
        onChangeText={(text) => setEditForm(prev => ({ ...prev, price: text }))}
        placeholder="Price"
        keyboardType="decimal-pad"
        blurOnSubmit={false}
      />

      <TextInput
        style={styles.input}
        value={editForm.supplier}
        onChangeText={(text) => setEditForm(prev => ({ ...prev, supplier: text }))}
        placeholder="Supplier"
        blurOnSubmit={false}
      />

      <TextInput
        style={styles.input}
        value={editForm.image}
        onChangeText={(text) => setEditForm(prev => ({ ...prev, image: text }))}
        placeholder="Image URL"
        blurOnSubmit={false}
      />

      <TextInput
        style={styles.input}
        value={editForm.barcode}
        onChangeText={(text) => setEditForm(prev => ({ ...prev, barcode: text }))}
        placeholder="Barcode"
        blurOnSubmit={false}
      />

      <View style={styles.editButtons}>
        <TouchableOpacity
          style={[styles.editButton, styles.cancelButton]}
          onPress={onCancel}
        >
          <ThemedText style={styles.editButtonText}>Cancel</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editButton, styles.saveButton]}
          onPress={onUpdate}
        >
          <ThemedText style={styles.editButtonText}>Save Changes</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  editForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  editButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 