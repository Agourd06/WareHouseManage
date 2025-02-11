import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Product } from '@/app/context/ProductContext';

interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  mostAddedProducts: any[];
  mostRemovedProducts: any[];
}

export default function StatisticsScreen() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, productsResponse] = await Promise.all([
          axios.get('http://192.168.8.107:3000/statistics'),
          axios.get('http://192.168.8.107:3000/products')
        ]);

        const products = productsResponse.data;
        const outOfStock = products.filter((p: Product) => 
          p.stocks.reduce((acc, s) => acc + s.quantity, 0) === 0
        ).length;

        const totalStockValue = products.reduce((acc: number, p: Product) => 
          acc + p.stocks.reduce((stockAcc, s) => stockAcc + s.quantity, 0), 0
        );

        setStats({
          ...statsResponse.data,
          outOfStock,
          totalStockValue
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Statistics</ThemedText>

        <ThemedView style={styles.statCard}>
          <ThemedText type="subtitle">Total Products</ThemedText>
          <ThemedText>{stats?.totalProducts}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText type="subtitle">Out of Stock Products</ThemedText>
          <ThemedText>{stats?.outOfStock}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statCard}>
          <ThemedText type="subtitle">Total Stock Value</ThemedText>
          <ThemedText>{stats?.totalStockValue} units</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  statCard: {
    padding: 16,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 