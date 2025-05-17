import React, { useEffect, useState } from 'react';
import { HourlyTraffic } from '../types';
import { apiService } from '../lib/apiService';
import { format, parse } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TrafficHistoryChartProps {
  storeId: number;
}

const TrafficHistoryChart: React.FC<TrafficHistoryChartProps> = ({ storeId }) => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      
      try {
        const history = await apiService.getTrafficHistory(storeId);
        if (history) {
          const hourlyData = history.hourly_data;
          
          // Format hours for display
          const labels = hourlyData.map(hour => {
            try {
              const date = parse(hour.hour, 'yyyy-MM-dd-HH', new Date());
              return format(date, 'HH:00');
            } catch (error) {
              return hour.hour;
            }
          });
          
          // Prepare chart data
          setChartData({
            labels,
            datasets: [
              {
                label: 'Customers In',
                data: hourlyData.map(hour => hour.customers_in),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1,
              },
              {
                label: 'Customers Out',
                data: hourlyData.map(hour => hour.customers_out),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1,
              },
              {
                label: 'Net Change',
                data: hourlyData.map(hour => hour.net_change),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.1,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching history data for chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();

    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchHistoryData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [storeId]);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Store ${storeId} - Traffic History (Last 24 Hours)`,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default TrafficHistoryChart;
