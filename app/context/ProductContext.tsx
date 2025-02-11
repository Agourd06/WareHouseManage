import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Location {
  city: string;
  latitude: number;
  longitude: number;
}

interface Stock {
  id: number;
  name: string;
  quantity: number;
  localisation: Location;
}

interface EditHistory {
  warehousemanId: number;
  at: string;
}

interface Product {
  id: number;
  name: string;
  type: string;
  barcode: string;
  price: number;
  solde?: number;
  supplier: string;
  image: string;
  stocks: Stock[];
  editedBy: EditHistory[];
}

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export default function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.8.107:3000/products');
      const transformedProducts = response.data.map((product: any) => ({
        ...product,
        id: Number(product.id)
      }));
      setProducts(transformedProducts);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://192.168.8.107:3000/products');
        const transformedProducts = response.data.map((product: any) => ({
          ...product,
          id: Number(product.id)
        }));
        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products' + err);
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export type { Product }; 