import { StoreTraffic, StoreTrafficHistory } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  // Get current traffic for all stores
  async getCurrentTraffic(): Promise<StoreTraffic[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/traffic/current`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching current traffic:', error);
      return [];
    }
  }

  // Get current traffic for a specific store
  async getStoreTraffic(storeId: number): Promise<StoreTraffic | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/traffic/current/${storeId}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching traffic for store ${storeId}:`, error);
      return null;
    }
  }

  // Get traffic history for a specific store
  async getTrafficHistory(storeId: number): Promise<StoreTrafficHistory | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/traffic/history/${storeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching traffic history for store ${storeId}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
