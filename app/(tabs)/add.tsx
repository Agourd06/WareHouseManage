import { useState, useEffect } from 'react';
import { StyleSheet, Image, ScrollView, Alert, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Picker } from '@react-native-picker/picker';
import { useProducts } from '@/app/context/ProductContext';

interface Warehouse {
  id: number;
  name: string;
  localisation: {
    city: string;
    latitude: number;
    longitude: number;
  };
}

export default function AddProductScreen() {
  const router = useRouter();
  const { products } = useProducts();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    barcode: '',
    price: '',
    supplier: '',
    image: '',
    warehouseId: ''
  });

  useEffect(() => {
    const uniqueWarehouses = products.reduce((acc: Warehouse[], product) => {
      product.stocks.forEach(stock => {
        if (!acc.find(w => w.id === stock.id)) {
          acc.push({
            id: stock.id,
            name: stock.name,
            localisation: stock.localisation
          });
        }
      });
      return acc;
    }, []);
    
    setWarehouses(uniqueWarehouses);
  }, [products]);

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.price || !formData.warehouseId) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      const newProduct = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        stocks: [
          {
            id: Number(formData.warehouseId),
            name: warehouses.find(w => w.id === Number(formData.warehouseId))?.name,
            quantity: 0,
            localisation: {
              city: warehouses.find(w => w.id === Number(formData.warehouseId))?.localisation.city,
              latitude: 0,
              longitude: 0
            }
          }
        ],
        editedBy: []
      };

      await axios.post('http://192.168.8.107:3000/products', newProduct);
      Alert.alert('Success', 'Product added successfully');
      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add product');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.form}>
        <ThemedText type="title">Add New Product</ThemedText>

        <TextInput
          placeholder="Product Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <TextInput
          placeholder="Type"
          value={formData.type}
          onChangeText={(text) => setFormData({ ...formData, type: text })}
        />

        <TextInput
          placeholder="Barcode"
          value={formData.barcode}
          onChangeText={(text) => setFormData({ ...formData, barcode: text })}
        />

        <TextInput
          placeholder="Price"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Supplier"
          value={formData.supplier}
          onChangeText={(text) => setFormData({ ...formData, supplier: text })}
        />

        <TextInput
          placeholder="Image URL"
          value={formData.image}
          onChangeText={(text) => setFormData({ ...formData, image: text })}
        />

        <ThemedView style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.warehouseId}
            onValueChange={(itemValue) => setFormData({ ...formData, warehouseId: itemValue })}
            style={styles.picker}>
            <Picker.Item label="Select Warehouse" value="" />
            {warehouses.map((warehouse) => (
              <Picker.Item
                key={warehouse.id}
                label={`${warehouse.name} (${warehouse.localisation.city})`}
                value={warehouse.id.toString()}
              />
            ))}
          </Picker>
        </ThemedView>

        <Button onPress={handleSubmit} title="Add Product" />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    gap: 16,
  },
  pickerContainer: {
    borderRadius: 8,
    marginVertical: 8,
  },
  picker: {
    height: 50,
  },
}); 