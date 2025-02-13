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

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return {
      ...response.data,
      id: Number(response.data.id)
    };
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },

  updateProduct: async (id: number, product: Product): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },


}; 