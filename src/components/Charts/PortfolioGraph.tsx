import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type DataPoint = {
  month: string;
  value: number;
};

export default function PortfolioGraph() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      try {
        const mockData: DataPoint[] = [
          { month: 'Dec', value: 20000 },
          { month: 'Jan', value: 23000 },
          { month: 'Feb', value: 25000 },
          { month: 'Mar', value: 40000 },
          { month: 'Apr', value: 37000 },
          { month: 'May', value: 45000 },
          { month: 'Jun', value: 42000 },
          { month: 'Jul', value: 48000 },
          { month: 'Aug', value: 46000 },
          { month: 'Sep', value: 44000 },
          { month: 'Oct', value: 40000 },
          { month: 'Nov', value: 39000 },
        ];
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load chart data');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between mb-2">
        <div className='ml-[15px]'>
          <h2 className="text-md font-bold text-[20px]">
            $0.3129 <span className="text-[#4BCD18] text-[16px] ml-2">($0.0529 (+20.35%))</span>
          </h2>
          <div className="text-xs mt-1 text-gray-400">Portfolio value</div>
        </div>
        <select className="px-4 text-gray-500 py-2 border rounded-lg text-sm mb-1">
          <option>This Year</option>
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500 text-center h-52 flex items-center justify-center">
          Loading chart...
        </div>
      ) : error ? (
        <div className="text-sm text-red-500 text-center h-52 flex items-center justify-center">
          {error}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="month"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickMargin={16}
            />
            <YAxis
              tickFormatter={(value) =>
                value === 0 ? '0' : `${(value / 1000).toFixed(0)}k`
              }
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickMargin={20}
            />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
              labelFormatter={(label: string) => `Month: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#480090"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <div className="flex justify-center mt-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <span>Balance</span>
        </div>
      </div>
    </div>
  );
}
