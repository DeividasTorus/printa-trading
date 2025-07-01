import React, { useEffect, useState } from 'react';

type TradeMetricRow = {
  label: string;
  comparison?: string;
  riskFreeRate?: string;
  total?: string;
};

export default function TradesSummary() {
  const [data, setData] = useState<TradeMetricRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Simulated API data structure
        const mockData: TradeMetricRow[] = [
          {
            label: 'Starting Capital ($)',
            comparison: '81,252',
            riskFreeRate: '3574534.805',
            total: '574584.805',
          },
          {
            label: 'Time Period (Years)',
            comparison: '81,252',
            riskFreeRate: '5',
            total: '574584.805',
          },
          {
            label: 'Annualized Daily Return',
            comparison: '81,252',
            riskFreeRate: '5',
            total: '-',
          },
          {
            label: 'Out of which Positive/Negative',
            comparison: 'MESM5',
            riskFreeRate: '3574534.805',
            total: '-',
          },
          {
            label: 'Total Profit/Loss ($)',
            comparison: 'MESM5',
            riskFreeRate: '3574534.805',
            total: '-',
          },
        ];

        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trade summary');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="px-6 lg:px-10 py-8 text-center text-gray-500">
        Loading trade summary...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 lg:px-10 py-8 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow px-6 py-5 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold">Active Positions</h3>
        <button className="text-sm px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">
          This Year ▾
        </button>
      </div>
      <table className="w-full text-sm text-left border-separate border-spacing-y-1">
        <thead>
          <tr className="text-gray-500 bg-gray-100">
            <th className="py-2 px-4 rounded-l-md">Name</th>
            <th className="py-2 px-4">Comparison S&P</th>
            <th className="py-2 px-4">Risk-Free Rate</th>
            <th className="py-2 px-4 rounded-r-md">Total (NQ and ES) All Trades</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.label}
              className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} text-gray-700`}
            >
              <td className="px-4 py-3 font-medium">{row.label}</td>
              <td className="px-4 py-3">{row.comparison ?? '-'}</td>
              <td className="px-4 py-3">{row.riskFreeRate ?? '-'}</td>
              <td className="px-4 py-3">{row.total ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
