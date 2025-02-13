import api from './api';
import type { Product } from '@/app/context/ProductContext';

interface Statistics {
  totalProducts: number;
  outOfStock: number;
  totalStockValue: number;
  totalMoneyValue: number;
  mostAddedProducts: any[];
  mostRemovedProducts: any[];
}

export const statisticsService = {
  getStatistics: async (): Promise<Statistics> => {
    const [statsResponse, productsResponse] = await Promise.all([
      api.get('/statistics'),
      api.get('/products')
    ]);

    const products = productsResponse.data;
    const outOfStock = products.filter((p: Product) => 
      p.stocks.reduce((acc, s) => acc + s.quantity, 0) === 0
    ).length;

    const totalStockValue = products.reduce((acc: number, p: Product) => 
      acc + p.stocks.reduce((stockAcc, s) => stockAcc + s.quantity, 0), 0
    );

    const totalMoneyValue = products.reduce((total: number, product: Product) => {
      const productTotal = product.stocks.reduce((stockTotal : number, stock) => {
        return stockTotal + (stock.quantity * product.price);
      }, 0);
      return total + productTotal;
    }, 0);

    return {
      ...statsResponse.data,
      outOfStock,
      totalStockValue,
      totalMoneyValue
    };
  },
}; 