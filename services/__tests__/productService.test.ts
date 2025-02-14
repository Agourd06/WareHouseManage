import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { productService } from '../productService';
import api from '../api';

const mock = new MockAdapter(api);

describe('productService', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should create a product successfully', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 99.99,
      supplier: 'Test Supplier',
      image: 'test.jpg',
      barcode: '123456',
      type: 'Electronics',
      stocks: [],
      editedBy: []
    };

    // Mock the API response
    mock.onPost('/products').reply(200, {
      ...newProduct,
      id: '123'
    });

    const result = await productService.createProduct(newProduct);

    expect(result).toEqual({
      ...newProduct,
      id: expect.any(String)
    });
  });
}); 