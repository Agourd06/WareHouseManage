import { useState } from 'react';
import { Image, StyleSheet, Pressable, View, Text, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useProducts } from '@/app/context/ProductContext';
import type { Product } from '@/app/context/ProductContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/app/context/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import Scanner from '@/components/Scanner';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomeScreen() {
  const { products, loading, error, refreshProducts } = useProducts();
  const router = useRouter();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery)
  );

  const handleBarcodeScan = (barcode: string) => {
    setSearchQuery(barcode);
    setShowScanner(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Error: {error}</ThemedText>
      </ThemedView>
    );
  }

  const getStockColor = (totalStock: number) => {
    if (totalStock > 10) return '#4CAF50';  
    if (totalStock > 0) return '#FF9800';   
    return '#F44336';                       
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const totalStock = item.stocks.reduce((acc, stock) => acc + stock.quantity, 0);
    
    return (
      <Pressable 
        onPress={() => router.push(`/product/${item.id}`)}
        style={({ pressed }) => [
          styles.productCard,
          pressed && { opacity: 0.9 }
        ]}
      >
        <Image 
          source={{ uri: item.image }} 
          style={styles.productImage}
        />
        <View style={styles.productContent}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <View style={[styles.stockBadge, { backgroundColor: getStockColor(totalStock) }]}>
            <Text style={styles.stockText}>{totalStock} units</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']} // Android
            progressBackgroundColor="#FFFFFF" // Android
          />
        }
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <Text style={styles.welcomeText}>Welcome Back {user?.name} 👋</Text>
                <Text style={styles.headerTitle}>Inventory Manager</Text>
                
                <View style={styles.searchContainer}>
                  <View style={styles.searchWrapper}>
                    <FontAwesome name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search by name or scan barcode"
                      placeholderTextColor="#94A3B8"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                    {searchQuery !== '' && (
                      <TouchableOpacity 
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                      >
                        <FontAwesome name="times-circle" size={20} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.scanButton}
                    onPress={() => setShowScanner(true)}
                  >
                    <FontAwesome name="camera" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statValue}>{filteredProducts.length}</Text>
                    <Text style={styles.statLabel}>Products</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        }
      />

      {showScanner && (
        <Scanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
 
  productList: {
    padding: 12,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  productImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#F1F5F9',
  },
  productContent: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 8,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  stockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  titleContainer: {
    padding: 16,
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  headerSection: {
    marginBottom: 20,
  },
  headerGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    padding: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#E2E8F0',
    marginBottom: 8,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1E293B',
  },
  clearButton: {
    padding: 8,
  },
  scanButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
