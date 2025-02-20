import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Image, ScrollView, Alert, TextInput, Button, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { useProducts } from '@/app/context/ProductContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Picker } from '@react-native-picker/picker';
import { productService } from '@/services/productService';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '@/app/context/UserContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { generateProductPDF } from '@/utils/pdfGenerator';
import Toast from 'react-native-toast-message';

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const { products, refreshProducts, loading } = useProducts();
  const router = useRouter();
  const product = products.find(p => p.id.toString() === id);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    name: '',
    city: '',
    latitude: '',
    longitude: ''
  });
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: product?.name || '',
    price: product?.price.toString() || '',
    supplier: product?.supplier || '',
    image: product?.image || '',
    barcode: product?.barcode || '',
  });

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

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
          { 
            warehousemanId: user?.id || 0,
            warehousemanName: user?.name || 'Unknown',
            at: new Date().toISOString() 
          }
        ]
      };

      await productService.updateProduct(product.id.toString(), updatedProduct);
      await refreshProducts();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Stock updated successfully'
      });
      setQuantity('');
      setSelectedWarehouse('');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update stock'
      });
    }
  };

  const handleAddWarehouse = async () => {
    try {
      if (!newWarehouse.name || !newWarehouse.city) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill warehouse name and city'
        });
        return;
      }

      const newStock = {
        id: Date.now(), 
        name: newWarehouse.name,
        quantity: 0,
        localisation: {
          city: newWarehouse.city,
          latitude: Number(newWarehouse.latitude) || 0,
          longitude: Number(newWarehouse.longitude) || 0
        }
      };

      const updatedProduct = {
        ...product,
        stocks: [...product.stocks, newStock]
      };

      await productService.updateProduct(product.id.toString(), updatedProduct);
      await refreshProducts();
      setShowAddWarehouse(false);
      setNewWarehouse({ name: '', city: '', latitude: '', longitude: '' });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Warehouse added successfully'
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to add warehouse'
      });
    }
  };

  const handleDeleteProduct = async () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await productService.deleteProduct(product.id.toString());
              await refreshProducts();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Product deleted successfully'
              });
              router.replace('/(tabs)');
            } catch (error) {
              console.error(error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete product'
              });
            }
          }
        }
      ]
    );
  };

  const handleDeleteWarehouse = async (warehouseId: number) => {
    Alert.alert(
      "Delete Warehouse",
      "Are you sure you want to remove this warehouse?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedStocks = product.stocks.filter(s => s.id !== warehouseId);
              const updatedProduct = {
                ...product,
                stocks: updatedStocks,
                editedBy: [
                  ...product.editedBy,
                  {
                    warehousemanId: user?.id || 0,
                    warehousemanName: user?.name || 'Unknown',
                    at: new Date().toISOString()
                  }
                ]
              };

              await productService.updateProduct(product.id.toString(), updatedProduct);
              await refreshProducts();
              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Warehouse removed successfully'
              });
            } catch (error) {
              console.error(error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove warehouse'
              });
            }
          }
        }
      ]
    );
  };

  const totalStock = product.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
  const getStockColor = (total: number) => {
    if (total > 10) return '#4CAF50';
    if (total > 0) return '#FF9800';
    return '#F44336';
  };

  const handleUpdateProduct = async () => {
    try {
      if (!editForm.name || !editForm.price) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Name and price are required'
        });
        return;
      }

      const updatedProduct = {
        ...product,
        name: editForm.name,
        price: Number(editForm.price),
        supplier: editForm.supplier,
        image: editForm.image,
        barcode: editForm.barcode,
        editedBy: [
          ...product.editedBy,
          {
            warehousemanId: user?.id || 0,
            warehousemanName: user?.name || 'Unknown',
            at: new Date().toISOString()
          }
        ]
      };

      await productService.updateProduct(product.id.toString(), updatedProduct);
      await refreshProducts();
      setIsEditing(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Product updated successfully'
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update product'
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await generateProductPDF(product as any);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to generate PDF'
      });
    }
  };

  const EditForm = () => (
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
          onPress={() => setIsEditing(false)}
        >
          <ThemedText style={styles.editButtonText}>Cancel</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.editButton, styles.saveButton]}
          onPress={handleUpdateProduct}
        >
          <ThemedText style={styles.editButtonText}>Save Changes</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.mainContainer}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsEditing(true)}
            >
              <FontAwesome name="edit" size={20} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteActionButton]}
              onPress={handleDeleteProduct}
            >
              <FontAwesome name="trash" size={20} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.downloadButton]}
              onPress={handleDownloadPDF}
            >
              <FontAwesome name="file-pdf-o" size={20} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Download PDF</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <ThemedView style={styles.content}>
          {isEditing ? (
            <EditForm />
          ) : (
            <>
              <ThemedView style={styles.headerName}>
                <ThemedText style={styles.productName}>{product.name}</ThemedText>
                <ThemedText style={styles.price}>${product.price}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.infoCard}>
                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Type</ThemedText>
                  <ThemedText style={styles.infoValue}>{product.type}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Supplier</ThemedText>
                  <ThemedText style={styles.infoValue}>{product.supplier}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Barcode</ThemedText>
                  <ThemedText style={styles.infoValue}>{product.barcode}</ThemedText>
                </ThemedView>
              </ThemedView>
              
              <ThemedView style={[styles.stockIndicator, { backgroundColor: getStockColor(totalStock) }]}>
                <ThemedText style={styles.stockText}>
                  Total Stock: {totalStock} units
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Update Stock</ThemedText>
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
                    placeholder="Enter quantity to add/remove"
                    keyboardType="numeric"
                  />
                  
                  <ThemedView style={styles.quickActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.decrementButton]}
                      onPress={() => setQuantity(prev => (Number(prev) - 1).toString())}
                    >
                      <ThemedText style={styles.actionButtonText}>-1</ThemedText>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.incrementButton]}
                      onPress={() => setQuantity(prev => (Number(prev) + 1).toString())}
                    >
                      <ThemedText style={styles.actionButtonText}>+1</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                  
                  <TouchableOpacity 
                    style={styles.updateButton}
                    onPress={handleUpdateStock}
                  >
                    <FontAwesome name="refresh" size={20} color="#FFFFFF" />
                    <ThemedText style={styles.updateButtonText}>Update Stock</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.section}>
                <ThemedView style={styles.sectionHeader}>
                  <ThemedText type="subtitle">Warehouses & Stock</ThemedText>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setShowAddWarehouse(!showAddWarehouse)}
                  >
                    <FontAwesome name={showAddWarehouse ? "minus" : "plus"} size={20} color="#3B82F6" />
                  </TouchableOpacity>
                </ThemedView>

                {showAddWarehouse && (
                  <ThemedView style={styles.addWarehouseForm}>
                    <TextInput
                      style={styles.input}
                      value={newWarehouse.name}
                      onChangeText={(text) => setNewWarehouse(prev => ({ ...prev, name: text }))}
                      placeholder="Warehouse Name"
                    />
                    <TextInput
                      style={styles.input}
                      value={newWarehouse.city}
                      onChangeText={(text) => setNewWarehouse(prev => ({ ...prev, city: text }))}
                      placeholder="City"
                    />
                    <TextInput
                      style={styles.input}
                      value={newWarehouse.latitude}
                      onChangeText={(text) => setNewWarehouse(prev => ({ ...prev, latitude: text }))}
                      placeholder="Latitude (optional)"
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      value={newWarehouse.longitude}
                      onChangeText={(text) => setNewWarehouse(prev => ({ ...prev, longitude: text }))}
                      placeholder="Longitude (optional)"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity 
                      style={styles.submitButton}
                      onPress={handleAddWarehouse}
                    >
                      <ThemedText style={styles.submitButtonText}>Add Warehouse</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                )}

                <ThemedText type="subtitle" style={styles.sectionTitle}>Stock Locations:</ThemedText>
                {product.stocks.map(stock => (
                  <ThemedView key={stock.id} style={styles.locationCard}>
                    <View style={styles.locationHeader}>
                      <View>
                        <ThemedText style={styles.locationName}>{stock.name}</ThemedText>
                        <ThemedText>Quantity: {stock.quantity}</ThemedText>
                        <ThemedText>City: {stock.localisation.city}</ThemedText>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteWarehouse(stock.id)}
                        style={styles.deleteIcon}
                      >
                        <FontAwesome name="trash-o" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </ThemedView>
                ))}

                <ThemedText type="subtitle" style={styles.sectionTitle}>Edit History:</ThemedText>
                {product.editedBy.map((edit, index) => (
                  <ThemedView key={index} style={styles.historyCard}>
                    <ThemedText>Modified by: {edit.warehousemanName || `Warehouseman ${edit.warehousemanId}`}</ThemedText>
                    <ThemedText>At: {new Date(edit.at).toLocaleString()}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  header: {
    position: 'relative',
  },
  headerName: {
    paddingTop: 8,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#10B981',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 16,
  },
  infoValue: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '500',
  },
  stockIndicator: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  stockText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
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
  updateForm: {
    gap: 16,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteActionButton: {
    backgroundColor: '#EF4444',
  },
  decrementButton: {
    backgroundColor: '#EF4444',
  },
  incrementButton: {
    backgroundColor: '#10B981',
  },
  updateButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    padding: 8,
  },
  addWarehouseForm: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  locationCard: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  deleteIcon: {
    padding: 8,
  },
  historyCard: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    gap: 4,
    backgroundColor: '#f0f0f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
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
  downloadButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
}); 