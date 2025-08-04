import React, { useEffect, useState } from 'react';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

type Order = {
  date: string;
  time: string;
  symbol: string;
  open: number;
  close: number;
  change: number;
  direction: 'Buy' | 'Sell';
  pnl: string;
  realPnl: number;
  progress: string;
};

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

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('Year');
  const [showPicker, setShowPicker] = useState(false);
  const [dateRange, setDateRange] = useState<any>([
    {
      startDate: new Date('2020-01-01'),
      endDate: new Date('2025-12-31'),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Order[] = [
          { date: '2025.05.21', time: '20:45', symbol: 'SP500', open: 5895.5, close: 5895.5, change: -28.0, direction: 'Sell', pnl: '0.48%', realPnl: 12.35, progress: 'TP1 - 60%' },
          { date: '2025.05.21', time: '20:30', symbol: 'SP500', open: 5895.5, close: 5895.5, change: -15.0, direction: 'Sell', pnl: '0.72%', realPnl: 25.72, progress: 'TP1 - 50%' },
          { date: '2025.05.21', time: '20:25', symbol: 'SP500', open: 5895.5, close: 5895.5, change: -15.0, direction: 'Sell', pnl: '0.13%', realPnl: 4.50, progress: 'TP1 - 30%' },
          { date: '2025.05.21', time: '20:15', symbol: 'NDX', open: 5795.5, close: 5892, change: 0.0, direction: 'Sell', pnl: '0.13%', realPnl: 8.25, progress: 'TP2 - 80%' },
          { date: '2025.05.21', time: '20:00', symbol: 'SP500', open: 5892, close: 5892, change: 0.0, direction: 'Buy', pnl: '-0.12%', realPnl: -7.10, progress: 'SL Hit - 100%' },
          { date: '2025.05.20', time: '19:55', symbol: 'NDX', open: 5890, close: 5892, change: 0.0, direction: 'Buy', pnl: '-0.12%', realPnl: -6.88, progress: 'TP1 - 10%' },
          { date: '2025.05.20', time: '19:50', symbol: 'NDX', open: 5890, close: 5890, change: 27.5, direction: 'Buy', pnl: '-0.12%', realPnl: -5.33, progress: 'TP1 - 20%' },
          { date: '2025.05.20', time: '19:45', symbol: 'NDX', open: 5795.3, close: 5890, change: 27.5, direction: 'Buy', pnl: '-0.12%', realPnl: -3.42, progress: 'TP1 - 40%' },
          { date: '2025.05.20', time: '19:40', symbol: 'SP500', open: 5795.3, close: 5890, change: 0.0, direction: 'Buy', pnl: '-0.12%', realPnl: -2.14, progress: 'TP1 - 90%' },
        ];

        await new Promise((res) => setTimeout(res, 500));

        setOrders(response);
        setFilteredOrders(response);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterClick = (label: string) => {
    setSelectedFilter(label);
    if (label === 'Today') {
      const today = '2025.05.21';
      setFilteredOrders(orders.filter(order => order.date === today));
    } else if (label === 'Yesterday') {
      const yesterday = '2025.05.20';
      setFilteredOrders(orders.filter(order => order.date === yesterday));
    } else {
      setFilteredOrders(orders);
    }
  };

  const applyCalendarFilter = () => {
    const start = dateRange[0].startDate!;
    const end = dateRange[0].endDate!;
    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.date.replace(/\./g, '-'));
      return orderDate >= start && orderDate <= end;
    });
    setFilteredOrders(filtered);
    setSelectedFilter('Custom');
    setShowPicker(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-sm">
      <div className="flex mb-2 justify-end items-center">
        <div className="flex items-center">
          {['Today', 'Yesterday', 'Week', 'Month', 'Quarter', 'Year'].map((label) => {
            const isSelected = label === selectedFilter;
            const baseClasses = 'px-6 py-2 border';
            const selectedClasses = 'bg-[#F3E7FF] text-[#6C32A6] border-[#6C32A6]';
            const unselectedClasses = 'text-gray-400 border-gray-200 bg-[#FCFCFC]';
            const cornerClasses =
              label === 'Today' ? 'rounded-l-md' :
                label === 'Year' ? 'rounded-r-md' : '';

            return (
              <button
                key={label}
                onClick={() => handleFilterClick(label)}
                className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses} ${cornerClasses}`}
              >
                {label}
              </button>
            );
          })}

          <div className="relative inline-block ml-4">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="px-4 text-gray-500 py-2 border rounded-lg text-sm bg-white hover:bg-gray-50"
            >
              {formatDate(dateRange[0].startDate)} - {formatDate(dateRange[0].endDate)}
            </button>

            {showPicker && (
              <div className="absolute right-0 top-full mt-2 z-50 bg-white shadow-lg rounded-xl p-4 w-[fit-content]">
                <DateRange
                  editableDateInputs={true}
                  onChange={(ranges: RangeKeyDict) => setDateRange([ranges.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  months={window.innerWidth < 768 ? 1 : 2}
                  direction={window.innerWidth < 768 ? 'vertical' : 'horizontal'}
                  rangeColors={['#8b5cf6']}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowPicker(false)}
                    className="px-4 py-1.5 rounded border text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCalendarFilter}
                    className="px-4 py-1.5 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-x-auto p-5">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order History</h2>
        {loading ? (
          <div className="p-6 text-gray-400">Loading orders...</div>
        ) : (
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead className="text-gray-500">
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Open</th>
                <th className="px-4 py-2">Close</th>
                <th className="px-4 py-2">Change</th>
                <th className="px-4 py-2">Progress</th>
                <th className="px-4 py-2">Direction</th>
                <th className="px-4 py-2">PnL %</th>
                <th className="px-4 py-2">PnL</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => {
                const progress = extractProgressParts(order.progress);
                return (
                  <tr key={idx} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">{`${order.date} | ${order.time}`}</td>
                    <td className="px-4 py-2">{order.symbol}</td>
                    <td className="px-4 py-2">{order.open}</td>
                    <td className="px-4 py-2">{order.close}</td>
                    <td className="px-4 py-2">{order.change.toFixed(2)}</td>
                    <td className="py-2">
                      <div className="text-xs text-gray-700 mb-1">{progress.label}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-[60px] bg-gray-200 rounded h-2">
                          <div
                            className={`h-2 rounded ${progress.percent === 100 ? 'bg-green-500' : 'bg-yellow-400'}`}
                            style={{ width: `${progress.percent}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{progress.percent}%</span>
                      </div>
                    </td>
                    <td className={`px-4 py-2 font-medium ${order.direction === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>{order.direction}</td>
                    <td className={`px-4 py-2 font-medium ${order.pnl.startsWith('-') ? 'text-red-500' : 'text-green-600'}`}>{order.pnl}</td>
                    <td className={`px-4 py-2 font-medium ${order.realPnl < 0 ? 'text-red-500' : 'text-green-600'}`}>${order.realPnl.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;


