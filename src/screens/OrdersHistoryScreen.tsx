import React, { useEffect, useState } from 'react';

type Order = {
    date: string;
    time: string;
    symbol: string;
    open: number;
    close: number;
    change: number;
    direction: 'Buy' | 'Sell';
    pnl: string;
};

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFilter, setSelectedFilter] = useState<string>('Year');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Order[] = [
                    { date: '2025.05.21', time: '20:45', symbol: 'SP500', open: 5895.5, close: 5895.5, change: -28.0, direction: 'Sell', pnl: '0.48%' },
                    { date: '2025.05.21', time: '20:30', symbol: 'SP500', open: 5895.5, close: 5895.5, change: -15.0, direction: 'Sell', pnl: '0.72%' },
                    { date: '2025.05.21', time: '20:25', symbol: 'SP500', open: 5895.5, close: 5895.5, change: -15.0, direction: 'Sell', pnl: '0.13%' },
                    { date: '2025.05.21', time: '20:15', symbol: 'NDX', open: 5795.5, close: 5892, change: 0.0, direction: 'Sell', pnl: '0.13%' },
                    { date: '2025.05.21', time: '20:00', symbol: 'SP500', open: 5892, close: 5892, change: 0.0, direction: 'Buy', pnl: '-0.12%' },
                    { date: '2025.05.20', time: '19:55', symbol: 'NDX', open: 5890, close: 5892, change: 0.0, direction: 'Buy', pnl: '-0.12%' },
                    { date: '2025.05.20', time: '19:50', symbol: 'NDX', open: 5890, close: 5890, change: 27.5, direction: 'Buy', pnl: '-0.12%' },
                    { date: '2025.05.20', time: '19:45', symbol: 'NDX', open: 5795.3, close: 5890, change: 27.5, direction: 'Buy', pnl: '-0.12%' },
                    { date: '2025.05.20', time: '19:40', symbol: 'SP500', open: 5795.3, close: 5890, change: 0.0, direction: 'Buy', pnl: '-0.12%' },
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-sm">
            <div className="flex mb-6 justify-end items-center">
                <div className="flex items-center space-x-2">
                    {['Today', 'Yesterday', 'Week', 'Month', 'Quarter', 'Year'].map((label) => (
                        <button
                            key={label}
                            onClick={() => handleFilterClick(label)}
                            className={`px-4 py-2 rounded-md border ${label === selectedFilter
                                ? 'bg-violet-100 text-violet-600 border-violet-300'
                                : 'text-gray-500 border-gray-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                    <select className="border border-gray-300 px-3 py-2 rounded-md text-gray-700 bg-white">
                        <option>Select Period</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-md overflow-x-auto p-5">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order History</h2>
                {loading ? (
                    <div className="p-6 text-gray-400">Loading orders...</div>
                ) : (
                    <table className="min-w-full text-left border-separate border-spacing-y-2">
                        <thead className="text-gray-500">
                            <tr className='bg-gray-100'>
                                <th className="px-4 py-2">Date</th>
                                <th className="px-4 py-2">Symbol</th>
                                <th className="px-4 py-2">Open Price</th>
                                <th className="px-4 py-2">Close Price</th>
                                <th className="px-4 py-2">Change</th>
                                <th className="px-4 py-2">Direction</th>
                                <th className="px-4 py-2">PNL %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order, idx) => (
                                <tr key={idx} className="bg-white hover:bg-gray-50">
                                    <td className="px-4 py-2 whitespace-nowrap">{`${order.date} | ${order.time}`}</td>
                                    <td className="px-4 py-2">{order.symbol}</td>
                                    <td className="px-4 py-2">{order.open}</td>
                                    <td className="px-4 py-2">{order.close}</td>
                                    <td className="px-4 py-2">{order.change.toFixed(2)}</td>
                                    <td className={`px-4 py-2 font-medium ${order.direction === 'Buy' ? 'text-green-500' : 'text-red-500'}`}>
                                        {order.direction}
                                    </td>
                                    <td className={`px-4 py-2 font-medium ${order.pnl.startsWith('-') ? 'text-red-500' : 'text-green-600'}`}>
                                        {order.pnl}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;

