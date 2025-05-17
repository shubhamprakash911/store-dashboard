'use client';

import React, { useState, useEffect } from 'react';
import LiveTrafficTable from '../../components/LiveTrafficTable';
import HistoryTrafficTable from '../../components/HistoryTrafficTable';
import TrafficHistoryChart from '../../components/TrafficHistoryChart';
import { socketService } from '../../lib/socketService';

export default function Dashboard() {
  const [selectedStoreId, setSelectedStoreId] = useState<number>(10); // Default store ID
  const [availableStores, setAvailableStores] = useState<number[]>([10]); // Default available store

  useEffect(() => {
    // Connect to socket service
    socketService.connect();

    // Handle initial traffic data to get available stores
    const handleInitialTraffic = (data: any[]) => {
      if (data && data.length > 0) {
        const storeIds = [...new Set(data.map(item => item.store_id))];
        setAvailableStores(storeIds);
        
        // If current selected store is not in the list, select the first one
        if (!storeIds.includes(selectedStoreId) && storeIds.length > 0) {
          setSelectedStoreId(storeIds[0]);
        }
      }
    };

    // Register event listener
    socketService.on('initialTraffic', handleInitialTraffic);

    // Clean up on unmount
    return () => {
      socketService.off('initialTraffic', handleInitialTraffic);
    };
  }, [selectedStoreId]);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Store Traffic Dashboard</h1>
          
          <div className="flex items-center">
            <label htmlFor="store-selector" className="mr-2 font-medium">
              Select Store:
            </label>
            <select
              id="store-selector"
              className="bg-white border border-gray-300 rounded-md px-3 py-2"
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(parseInt(e.target.value))}
            >
              {availableStores.map((storeId) => (
                <option key={storeId} value={storeId}>
                  Store {storeId}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LiveTrafficTable storeId={selectedStoreId} />
          <TrafficHistoryChart storeId={selectedStoreId} />
        </div>
        
        <div className="mb-8">
          <HistoryTrafficTable storeId={selectedStoreId} />
        </div>
      </div>
    </main>
  );
}
