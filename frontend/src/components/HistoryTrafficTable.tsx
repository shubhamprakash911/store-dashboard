import React, { useEffect, useState } from 'react';
import { HourlyTraffic, StoreTrafficHistory } from '../types';
import { apiService } from '../lib/apiService';
import { format, parse } from 'date-fns';

interface HistoryTrafficTableProps {
  storeId: number;
}

const HistoryTrafficTable: React.FC<HistoryTrafficTableProps> = ({ storeId }) => {
  const [historyData, setHistoryData] = useState<HourlyTraffic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const history = await apiService.getTrafficHistory(storeId);
        if (history) {
          setHistoryData(history.hourly_data);
        } else {
          setError('Failed to fetch history data');
        }
      } catch (err) {
        setError('An error occurred while fetching history data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchHistoryData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [storeId]);

  // Format hour string for display
  const formatHour = (hourString: string) => {
    try {
      // Parse the hour string (format: YYYY-MM-DD-HH)
      const date = parse(hourString, 'yyyy-MM-dd-HH', new Date());
      return format(date, 'MMM dd, HH:00');
    } catch (error) {
      console.error('Error parsing date:', error);
      return hourString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-green-600 text-white">
        <h2 className="text-xl font-bold">Hourly Traffic History (Last 24 Hours)</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customers In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customers Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {historyData.length > 0 ? (
              historyData.map((hourData, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatHour(hourData.hour)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {hourData.customers_in}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {hourData.customers_out}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${hourData.net_change > 0 ? 'text-green-600' : hourData.net_change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {hourData.net_change > 0 ? '+' : ''}{hourData.net_change}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No history data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTrafficTable;
