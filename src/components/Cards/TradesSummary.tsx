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
    <div className="bg-white rounded-xl h-[433px] shadow px-6 py-5 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold mb-4">Stats</h2>
         <select className="px-4 text-gray-500 py-2 border rounded-lg text-sm mb-1">
          <option>This Year</option>
        </select>
      </div>
      <table className="w-full text-sm text-left border-separate border-spacing-y-1">
        <thead>
          <tr className="text-gray-500 bg-gray-100">
            <th className="py-3 px-4 rounded-l-md">Name</th>
            <th className="py-3 px-4">Comparison S&P</th>
            <th className="py-3 px-4">Risk-Free Rate</th>
            <th className="py-3 px-4 rounded-r-md">Total (NQ and ES) All Trades</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.label}
            >
              <td className="px-4 py-3 font-medium border-b-2">{row.label}</td>
              <td className="px-4 py-3 border-b-2">{row.comparison ?? '-'}</td>
              <td className="px-4 py-3 border-b-2">{row.riskFreeRate ?? '-'}</td>
              <td className="px-4 py-3 border-b-2">{row.total ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
