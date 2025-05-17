import React, { useEffect, useState } from 'react';
import { StoreTraffic } from '../types';
import { socketService } from '../lib/socketService';
import { format } from 'date-fns';

interface LiveTrafficTableProps {
  storeId?: number; // Optional: to filter for a specific store
}

const LiveTrafficTable: React.FC<LiveTrafficTableProps> = ({ storeId }) => {
  const [trafficData, setTrafficData] = useState<StoreTraffic[]>([]);

  useEffect(() => {
    // Connect to socket service
    socketService.connect();

    // Handle initial traffic data
    const handleInitialTraffic = (data: StoreTraffic[]) => {
      if (storeId) {
        // Filter for specific store if storeId is provided
        setTrafficData(data.filter(item => item.store_id === storeId));
      } else {
        setTrafficData(data);
      }
    };

    // Handle traffic updates
    const handleTrafficUpdate = (data: StoreTraffic) => {
      if (storeId && data.store_id !== storeId) {
        return; // Skip if we're filtering for a specific store and this isn't it
      }

      setTrafficData(prevData => {
        // Check if this store already exists in our data
        const existingIndex = prevData.findIndex(item => item.store_id === data.store_id);
        
        if (existingIndex >= 0) {
          // Update existing store data
          const newData = [...prevData];
          newData[existingIndex] = data;
          return newData;
        } else {
          // Add new store data
          return [...prevData, data];
        }
      });
    };

    // Register event listeners
    socketService.on('initialTraffic', handleInitialTraffic);
    socketService.on('trafficUpdate', handleTrafficUpdate);

    // Clean up on unmount
    return () => {
      socketService.off('initialTraffic', handleInitialTraffic);
      socketService.off('trafficUpdate', handleTrafficUpdate);
    };
  }, [storeId]);

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date) => {
    if (!(timestamp instanceof Date)) {
      timestamp = new Date(timestamp);
    }
    return format(timestamp, 'HH:mm:ss');
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-blue-600 text-white">
        <h2 className="text-xl font-bold">Live Store Traffic</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Store ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Customers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trafficData.length > 0 ? (
              trafficData.map((traffic) => (
                <tr key={traffic.store_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {traffic.store_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {traffic.current_customers}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatTimestamp(traffic.timestamp)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No traffic data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveTrafficTable;
