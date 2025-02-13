import api from './api';

interface Warehouseman {
  id: number;
  name: string;
  secretKey: string;
}

export const warehousemanService = {
  validateSecretKey: async (secretKey: string): Promise<Warehouseman | null> => {
    const response = await api.get('/warehousemans');
    const warehousemans = response.data;
    return warehousemans.find((w: Warehouseman) => w.secretKey === secretKey) || null;
  },
}; 