import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Image, ScrollView, Alert, TextInput, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useProducts } from '@/app/context/ProductContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Picker } from '@react-native-picker/picker';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { products, refreshProducts } = useProducts();
  const router = useRouter();
  const product = products.find(p => p.id.toString() === id);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');

  if (!product) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Product not found</ThemedText>
      </ThemedView>
    );
  }

  const handleUpdateStock = async () => {
    try {
      const stock = product.stocks.find(s => s.id.toString() === selectedWarehouse);
      if (!stock) return;

      const updatedStocks = product.stocks.map(s => {
        if (s.id.toString() === selectedWarehouse) {
          return { ...s, quantity: s.quantity + Number(quantity) };
        }
        return s;
      });

      const updatedProduct = {
        ...product,
        stocks: updatedStocks,
        editedBy: [
          ...product.editedBy,
          { warehousemanId: 1, at: new Date().toISOString() }
        ]
      };

      await axios.put(`http://192.168.8.107:3000/products/${product.id}`, updatedProduct);
      await refreshProducts();
      Alert.alert('Success', 'Stock updated successfully');
      setQuantity('');
      setSelectedWarehouse('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update stock');
    }
  };

  const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
  const getStockColor = (total: number) => {
    if (total > 10) return '#4CAF50';
    if (total > 0) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <ThemedView style={styles.content}>
          <ThemedText type="title">{product.name}</ThemedText>
          <ThemedText type="subtitle">Price: ${product.price}</ThemedText>
          <ThemedText>Type: {product.type}</ThemedText>
          <ThemedText>Supplier: {product.supplier}</ThemedText>
          <ThemedText>Barcode: {product.barcode}</ThemedText>
          
          <ThemedView style={[styles.stockIndicator, { backgroundColor: getStockColor(totalStock) }]}>
            <ThemedText style={styles.stockText}>
              Total Stock: {totalStock} units
            </ThemedText>
          </ThemedView>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Update Stock:</ThemedText>
          <ThemedView style={styles.updateForm}>
            <Picker
              selectedValue={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
              style={styles.picker}>
              <Picker.Item label="Select Warehouse" value="" />
              {product.stocks.map((stock) => (
                <Picker.Item
                  key={stock.id}
                  label={`${stock.name} (Current: ${stock.quantity})`}
                  value={stock.id.toString()}
                />
              ))}
            </Picker>
            
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Enter quantity to add and Remove (use - )"
              keyboardType="numeric"
            />
            
            <Button title="Update Stock" onPress={handleUpdateStock} />
          </ThemedView>

          <ThemedText type="subtitle" style={styles.sectionTitle}>Stock Locations:</ThemedText>
          {product.stocks.map(stock => (
            <ThemedView key={stock.id} style={styles.locationCard}>
              <ThemedText>{stock.name}</ThemedText>
              <ThemedText>Quantity: {stock.quantity}</ThemedText>
              <ThemedText>City: {stock.localisation.city}</ThemedText>
            </ThemedView>
          ))}

          <ThemedText type="subtitle" style={styles.sectionTitle}>Edit History:</ThemedText>
          {product.editedBy.map((edit, index) => (
            <ThemedView key={index} style={styles.historyCard}>
              <ThemedText>Modified by: Warehouseman {edit.warehousemanId}</ThemedText>
              <ThemedText>At: {new Date(edit.at).toLocaleString()}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    marginTop: 16,
  },
  stockIndicator: {
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  stockText: {
    color: 'white',
    textAlign: 'center',
  },
  locationCard: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    gap: 4,
    backgroundColor: '#f5f5f5',
  },
  updateForm: {
    gap: 12,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  historyCard: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    gap: 4,
    backgroundColor: '#f0f0f0',
  },
}); 