import api from './api';
import type { Product } from '@/app/context/ProductContext';
import axios from 'axios';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data.map((product: any) => ({
      ...product,
      id: Number(product.id)
    }));
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const timestamp = Date.now() % 1000; // Get last 3 digits
    const newId = timestamp.toString();
    const productWithId = {
      ...product,
      id: newId
    };
    
    const response = await api.post('/products', productWithId);
    return response.data;
  },

  updateProduct: async (id: string, product: Product): Promise<Product> => {
    const response = await api.put(`/products/${id}`, {
      ...product,
      id: id
    });
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },


}; 