export interface Product {
  id: string;
  name: string;
  price: number;
  supplier: string;
  image: string;
  barcode: string;
  type: string;
  stocks: {
    id: number;
    name: string;
    quantity: number;
    localisation: {
      city: string;
      latitude: number;
      longitude: number;
    };
  }[];
  editedBy: {
    warehousemanId: number;
    warehousemanName: string;
    at: string;
  }[];
} 