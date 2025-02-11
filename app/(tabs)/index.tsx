import { Image, StyleSheet, Pressable } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useProducts } from '@/app/context/ProductContext';
import type { Product } from '@/app/context/ProductContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FlatList } from 'react-native';

export default function HomeScreen() {
  const { products, loading, error } = useProducts();
  const router = useRouter();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
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
        onPress={() => {
          router.push(`/product/${item.id}`);
        }}
        style={styles.productCardWrapper}
      >
        <ThemedView style={styles.productCard}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <ThemedView style={styles.productInfo}>
            <ThemedText type="subtitle" numberOfLines={1}>{item.name}</ThemedText>
            <ThemedText>Price: ${item.price}</ThemedText>
            <ThemedView style={styles.stockIndicator}>
              <ThemedView 
                style={[
                  styles.stockDot, 
                  { backgroundColor: getStockColor(totalStock) }
                ]} 
              />
              <ThemedText>Stock: {totalStock}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
        ListHeaderComponent={
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Products</ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  titleContainer: {
    padding: 16,
    marginBottom: 16,
  },
  productList: {
    gap: 16,
    padding: 16,
  },
  productCardWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  productCard: {
    margin: 4,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    gap: 4,
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  row: {
    justifyContent: 'space-between',
  },
});
