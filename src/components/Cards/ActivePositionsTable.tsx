import React, { useEffect, useState } from 'react';

type Position = {
  date: string;
  symbol: string;
  quantity: number;
  openPrice: number;
  closePrice: number;
  progress: string;
  change: number;
  direction: 'Buy' | 'Sell';
  pnl: number;
};

export default function ActivePositionsTable() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to extract label and percentage from progress string
  const extractProgressParts = (progress: string): { label: string; percent: number } => {
    const match = progress.match(/^(.+?)\s*-\s*(\d+)%$/);
    if (match) {
      return {
        label: match[1].trim(),
        percent: parseInt(match[2], 10),
      };
    }
    return { label: progress, percent: 0 };
  };

  useEffect(() => {
    const mockData: Position[] = [
      {
        date: '2025.06.01',
        symbol: 'AAPL',
        quantity: 10,
        openPrice: 186.5,
        closePrice: 189.2,
        progress: 'TP1 - 60%',
        change: 2.7,
        direction: 'Buy',
        pnl: 1.44,
      },
      {
        date: '2025.05.21',
        symbol: 'MESM5',
        quantity: 5,
        openPrice: 588.09,
        closePrice: 587.47,
        progress: 'TP1 - 50%',
        change: -3.45,
        direction: 'Sell',
        pnl: 0.08,
      },
      {
        date: '2025.06.10',
        symbol: 'TSLA',
        quantity: 2,
        openPrice: 172.0,
        closePrice: 169.0,
        progress: 'SL Hit - 100%',
        change: -5.1,
        direction: 'Buy',
        pnl: -2.9,
      },
    ];

    const timer = setTimeout(() => {
      try {
        setPositions(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl mt-4">
      <div className="flex justify-between mb-2">
        <h2 className="text-md font-bold">Active Positions</h2>
        <select className="px-4 text-gray-500 py-2 border rounded-lg text-sm mb-1">
          <option>This Year</option>
        </select>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Symbol</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Open Price</th>
              <th className="p-2">Close Price</th>
              <th className="p-2">Progress</th>
              <th className="p-2">Change</th>
              <th className="p-2">Direction</th>
              <th className="p-2">PnL%</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, idx) => {
              const progress = extractProgressParts(pos.progress);
              return (
                <tr key={idx} className="border-t">
                  <td className="p-2">{pos.date}</td>
                  <td className="p-2">{pos.symbol}</td>
                  <td className="p-2">{pos.quantity}</td>
                  <td className="p-2">{pos.openPrice}</td>
                  <td className="p-2">{pos.closePrice}</td>
                  <td className="p-2">
                    <div className="text-xs text-gray-700 mb-1">{progress.label}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-[60px] bg-gray-200 rounded h-2">
                        <div
                          className={`h-2 rounded ${progress.percent === 100 ? 'bg-green-500' : 'bg-yellow-400'
                            }`}
                          style={{ width: `${progress.percent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{progress.percent}%</span>
                    </div>
                  </td>
                  <td className={`p-2 ${pos.change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pos.change}
                  </td>
                  <td className={`p-2 ${pos.direction === 'Sell' ? 'text-red-500' : 'text-green-500'}`}>
                    {pos.direction}
                  </td>
                  <td className={`p-2 ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pos.pnl.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
