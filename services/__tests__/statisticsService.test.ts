import MockAdapter from 'axios-mock-adapter';
import { statisticsService } from '../statisticsService';
import api from '../api';

const mock = new MockAdapter(api);

describe('statisticsService', () => {
  afterEach(() => {
    mock.reset();
  });

  it('should calculate statistics correctly', async () => {
    // Mock data
    const mockProducts = [
      {
        id: '1',
        name: 'Product 1',
        price: 100,
        stocks: [{ quantity: 5 }, { quantity: 3 }]
      },
      {
        id: '2',
        name: 'Product 2',
        price: 50,
        stocks: [{ quantity: 0 }]
      }
    ];

    const mockStats = {
      totalProducts: 2,
      mostAddedProducts: [],
      mostRemovedProducts: []
    };

    // Mock API responses
    mock.onGet('/statistics').reply(200, mockStats);
    mock.onGet('/products').reply(200, mockProducts);

    const result = await statisticsService.getStatistics();

    expect(result).toEqual({
      ...mockStats,
      outOfStock: 1,
      totalStockValue: 8,
      totalMoneyValue: 800 // (5+3)*100 + 0*50
    });
  });
}); 