import MockAdapter from 'axios-mock-adapter';
import { warehousemanService } from '../warehousemanService';
import api from '../api';

const mock = new MockAdapter(api);

describe('warehousemanService', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should validate secret key correctly', async () => {
    const mockWarehousemans = [
      { id: 1, name: 'John', secretKey: 'secret123' },
      { id: 2, name: 'Jane', secretKey: 'key456' }
    ];

    // Mock API response
    mock.onGet('/warehousemans').reply(200, mockWarehousemans);

    // Test valid key
    const result1 = await warehousemanService.validateSecretKey('secret123');
    expect(result1).toEqual(mockWarehousemans[0]);

    // Test invalid key
    const result2 = await warehousemanService.validateSecretKey('wrongkey');
    expect(result2).toBeNull();
  });
}); 