import { CustomerMessage, HourlyTraffic, StoreTraffic, StoreTrafficHistory } from './types';

class TrafficService {
  private storeTraffic: Map<number, StoreTraffic> = new Map();
  private hourlyTraffic: Map<number, Map<string, HourlyTraffic>> = new Map();

  constructor() {
    // Initialize with empty data
  }

  // Process a new customer message from Kafka
  processMessage(message: CustomerMessage): StoreTraffic {
    const storeId = message.store_id;
    const timestamp = new Date(message.time_stamp);
    
    // Get current store traffic or initialize if it doesn't exist
    let currentTraffic = this.storeTraffic.get(storeId) || {
      store_id: storeId,
      current_customers: 0,
      timestamp: new Date()
    };

    // Update current customer count
    currentTraffic.current_customers += message.customers_in - message.customers_out;
    currentTraffic.timestamp = timestamp;
    
    // Save updated traffic
    this.storeTraffic.set(storeId, currentTraffic);
    
    // Update hourly traffic data
    this.updateHourlyTraffic(storeId, message, timestamp);
    
    return currentTraffic;
  }

  // Update hourly traffic statistics
  private updateHourlyTraffic(storeId: number, message: CustomerMessage, timestamp: Date): void {
    // Format hour key as YYYY-MM-DD-HH
    const hourKey = `${timestamp.getFullYear()}-${
      String(timestamp.getMonth() + 1).padStart(2, '0')
    }-${
      String(timestamp.getDate()).padStart(2, '0')
    }-${
      String(timestamp.getHours()).padStart(2, '0')
    }`;
    
    // Get store's hourly data or initialize if it doesn't exist
    if (!this.hourlyTraffic.has(storeId)) {
      this.hourlyTraffic.set(storeId, new Map());
    }
    
    const storeHourlyData = this.hourlyTraffic.get(storeId)!;
    
    // Get hour data or initialize if it doesn't exist
    let hourData = storeHourlyData.get(hourKey) || {
      hour: hourKey,
      customers_in: 0,
      customers_out: 0,
      net_change: 0
    };
    
    // Update hour data
    hourData.customers_in += message.customers_in;
    hourData.customers_out += message.customers_out;
    hourData.net_change = hourData.customers_in - hourData.customers_out;
    
    // Save updated hour data
    storeHourlyData.set(hourKey, hourData);
  }

  // Get current traffic for a specific store
  getCurrentTraffic(storeId: number): StoreTraffic | undefined {
    return this.storeTraffic.get(storeId);
  }

  // Get current traffic for all stores
  getAllCurrentTraffic(): StoreTraffic[] {
    return Array.from(this.storeTraffic.values());
  }

  // Get hourly traffic history for the last 24 hours for a specific store
  getTrafficHistory(storeId: number): StoreTrafficHistory {
    const now = new Date();
    const last24Hours: HourlyTraffic[] = [];
    
    // Generate the last 24 hour keys
    for (let i = 23; i >= 0; i--) {
      const hourDate = new Date(now);
      hourDate.setHours(now.getHours() - i);
      
      const hourKey = `${hourDate.getFullYear()}-${
        String(hourDate.getMonth() + 1).padStart(2, '0')
      }-${
        String(hourDate.getDate()).padStart(2, '0')
      }-${
        String(hourDate.getHours()).padStart(2, '0')
      }`;
      
      // Get store's hourly data
      const storeHourlyData = this.hourlyTraffic.get(storeId);
      
      // Get hour data or use empty data if it doesn't exist
      const hourData = storeHourlyData?.get(hourKey) || {
        hour: hourKey,
        customers_in: 0,
        customers_out: 0,
        net_change: 0
      };
      
      last24Hours.push(hourData);
    }
    
    return {
      store_id: storeId,
      hourly_data: last24Hours
    };
  }

  // Simulate Kafka messages for testing
  generateTestData(storeId: number = 10): CustomerMessage {
    const now = new Date();
    const customersIn = Math.floor(Math.random() * 3);
    const customersOut = Math.floor(Math.random() * 3);
    
    return {
      store_id: storeId,
      customers_in: customersIn,
      customers_out: customersOut,
      time_stamp: now.toISOString()
    };
  }
}

export const trafficService = new TrafficService();
