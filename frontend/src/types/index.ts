export interface CustomerMessage {
  store_id: number;
  customers_in: number;
  customers_out: number;
  time_stamp: string;
}

export interface StoreTraffic {
  store_id: number;
  current_customers: number;
  timestamp: Date;
}

export interface HourlyTraffic {
  hour: string;
  customers_in: number;
  customers_out: number;
  net_change: number;
}

export interface StoreTrafficHistory {
  store_id: number;
  hourly_data: HourlyTraffic[];
}
