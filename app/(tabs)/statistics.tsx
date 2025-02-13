import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { statisticsService } from '@/services/statisticsService';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  totalMoneyValue: number;
  mostAddedProducts: any[];
  mostRemovedProducts: any[];
}

export default function StatisticsScreen() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await statisticsService.getStatistics();
        setStats(statsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading statistics..." />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Statistics</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <ThemedView style={styles.statCard}>
            <FontAwesome name="cube" size={24} color="#007AFF" />
            <ThemedText style={styles.statValue}>{stats?.totalProducts}</ThemedText>
            <ThemedText style={styles.statLabel}>Total Products</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <FontAwesome name="warning" size={24} color="#FF3B30" />
            <ThemedText style={[styles.statValue, styles.errorText]}>
              {stats?.outOfStock}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Out of Stock</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <FontAwesome name="cubes" size={24} color="#34C759" />
            <ThemedText style={[styles.statValue, styles.successText]}>
              {stats?.totalStockValue}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Total Stock</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statCard}>
            <FontAwesome name="dollar" size={24} color="#007AFF" />
            <ThemedText style={[styles.statValue, styles.primaryText]}>
              ${stats?.totalMoneyValue?.toLocaleString('en-US')}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Total Value</ThemedText>
          </ThemedView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.6,
  },
  errorText: {
    color: '#FF3B30',
  },
  successText: {
    color: '#34C759',
  },
  primaryText: {
    color: '#007AFF',
  },
}); 