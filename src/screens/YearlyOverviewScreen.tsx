import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    ReferenceLine
} from 'recharts';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import TradesSummary from '../components/Cards/TradesSummary';
import StatsSummary from '../components/Cards/StatsSummary';
import CumulativePnLChart from '../components/Charts/CumulativePnLChart';
import MonteCarloSimulationChart from '../components/Charts/MonteCarloSimulationChart';

type Metric = { label: string; value: string; change: string };
type YearOverview = { year: string; pnl: number; metrics: Metric[] };

export default function YearlyOverviewScreen() {
    const [mockOverview, setMockOverview] = useState<YearOverview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [dateRange, setDateRange] = useState<Range[]>([
        {
            startDate: new Date('2020-01-01'),
            endDate: new Date('2025-12-31'),
            key: 'selection',
        },
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                const unifiedMockData: YearOverview[] = [
                    {
                        year: '2020',
                        pnl: 80,
                        metrics: [
                            { label: 'Total PnL', value: '18 200', change: '+2.0%' },
                            { label: 'Total Trades', value: '1 000', change: '+1.2%' },
                            { label: 'Total Profit', value: '15 000', change: '+2.5%' },
                            { label: 'Total Loss', value: '3 200', change: '-1.0%' },
                            { label: 'Win %', value: '58', change: '+1.0%' },
                            { label: 'Loss %', value: '42', change: '-1.0%' },
                        ],
                    },
                    {
                        year: '2021',
                        pnl: 130,
                        metrics: [
                            { label: 'Total PnL', value: '20 500', change: '+3.1%' },
                            { label: 'Total Trades', value: '1 300', change: '+2.0%' },
                            { label: 'Total Profit', value: '17 100', change: '+3.0%' },
                            { label: 'Total Loss', value: '3 400', change: '-0.5%' },
                            { label: 'Win %', value: '60', change: '+1.5%' },
                            { label: 'Loss %', value: '40', change: '-1.5%' },
                        ],
                    },
                    {
                        year: '2022',
                        pnl: 110,
                        metrics: [
                            { label: 'Total PnL', value: '19 800', change: '+2.8%' },
                            { label: 'Total Trades', value: '1 200', change: '+1.8%' },
                            { label: 'Total Profit', value: '16 500', change: '+2.7%' },
                            { label: 'Total Loss', value: '3 300', change: '-0.8%' },
                            { label: 'Win %', value: '61', change: '+1.0%' },
                            { label: 'Loss %', value: '39', change: '-1.0%' },
                        ],
                    },
                    {
                        year: '2023',
                        pnl: 200,
                        metrics: [
                            { label: 'Total PnL', value: '22 000', change: '+4.5%' },
                            { label: 'Total Trades', value: '1 500', change: '+2.5%' },
                            { label: 'Total Profit', value: '18 200', change: '+4.0%' },
                            { label: 'Total Loss', value: '3 800', change: '-1.2%' },
                            { label: 'Win %', value: '62', change: '+1.8%' },
                            { label: 'Loss %', value: '38', change: '-1.8%' },
                        ],
                    },
                    {
                        year: '2024',
                        pnl: 140,
                        metrics: [
                            { label: 'Total PnL', value: '21 300', change: '+3.6%' },
                            { label: 'Total Trades', value: '1 400', change: '+2.3%' },
                            { label: 'Total Profit', value: '17 900', change: '+3.5%' },
                            { label: 'Total Loss', value: '3 400', change: '-1.1%' },
                            { label: 'Win %', value: '63', change: '+1.9%' },
                            { label: 'Loss %', value: '37', change: '-1.9%' },
                        ],
                    },
                    {
                        year: '2025',
                        pnl: 190,
                        metrics: [
                            { label: 'Total PnL', value: '23 300', change: '+4.8%' },
                            { label: 'Total Trades', value: '1 600', change: '+3.0%' },
                            { label: 'Total Profit', value: '20 000', change: '+5.0%' },
                            { label: 'Total Loss', value: '3 300', change: '-1.3%' },
                            { label: 'Win %', value: '64', change: '+2.0%' },
                            { label: 'Loss %', value: '36', change: '-2.0%' },
                        ],
                    },
                ];

                setMockOverview(unifiedMockData);
                setLoading(false);
            } catch (err) {
                setError('Failed to load data');
                setLoading(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const filtered = mockOverview.filter((item) => {
        const yearDate = new Date(`${item.year}-01-01`);
        const start = dateRange[0].startDate!;
        const end = dateRange[0].endDate!;
        return yearDate >= start && yearDate <= end;
    });

    const yearlyData = filtered.map((item) => ({
        year: item.year,
        pnl: item.pnl,
    }));

    const statsMap: { [key: string]: number } = {};
    const changeMap: { [key: string]: string } = {};

    filtered.forEach((entry) => {
        entry.metrics.forEach((m) => {
            const key = m.label.toLowerCase().replace(/\s+/g, '');
            statsMap[key] = (statsMap[key] || 0) + parseFloat(m.value.replace(/\s|,/g, '').replace(',', '.'));
            changeMap[key] = m.change;
        });
    });

    const stats = {
        totalPL: statsMap['totalpnl']?.toFixed(2) || '0',
        totalTrades: statsMap['totaltrades']?.toFixed(0) || '0',
        profit: statsMap['totalprofit']?.toFixed(2) || '0',
        loss: statsMap['totalloss']?.toFixed(2) || '0',
        winPercentage: statsMap['win%']?.toFixed(0) || '0',
    };

    const rows = [
        { label: 'Total PnL', key: 'totalPL' },
        { label: 'Total Trades', key: 'totalTrades' },
        { label: 'Total Profit', key: 'profit' },
        { label: 'Total Loss', key: 'loss' },
        { label: 'Win %', key: 'winPercentage' },
    ];

    return (
        <div className="px-6 lg:px-10 py-8 bg-gray-100">
            <div className="relative mb-1 w-full flex justify-end">
                <div className="relative inline-block">
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="px-4 text-gray-500 py-2 border rounded-lg text-sm mb-1 bg-white hover:bg-gray-50"
                    >
                        {dateRange[0].startDate?.toLocaleDateString()} – {dateRange[0].endDate?.toLocaleDateString()}
                    </button>

                    {showPicker && (
                        <div className="absolute right-0 top-full mt-2 z-50 bg-white shadow-lg rounded-xl p-4 w-[fit-content]">
                            <DateRange
                                editableDateInputs={true}
                                onChange={(ranges: RangeKeyDict) => {
                                    setDateRange([ranges.selection]);
                                }}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                months={2}
                                direction="horizontal"
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
                                    onClick={() => setShowPicker(false)}
                                    className="px-4 py-1.5 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-gray-500 text-center py-20">Loading data...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-20">{error}</div>
            ) : (
                <>
                    <div className="bg-white rounded-xl shadow p-6 flex flex-col lg:flex-row gap-6 mb-8">
                        <div className="w-full lg:w-[100%]">
                            <h2 className="text-md font-semibold mb-4">Yearly PnL</h2>
                            <ResponsiveContainer width="100%" height={440}>
                                <BarChart data={yearlyData}>
                                    <XAxis dataKey="year" />
                                    <YAxis domain={['dataMin', 'dataMax']} />
                                    <Tooltip />
                                    <ReferenceLine y={0} stroke="#000" />
                                    <Bar dataKey="pnl" fill="#480090" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full lg:w-[50%]">
                            <StatsSummary
                                title="Annual Totals"
                                stats={stats}
                                loading={false}
                                rows={rows}
                                showCards={true}
                                showPieChart={true}
                                screenType="yearly"
                            />
                        </div>
                    </div>

                    <TradesSummary />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-100 pt-8">
                        <CumulativePnLChart data={filtered} />
                        <MonteCarloSimulationChart data={filtered} />
                    </div>
                </>
            )}
        </div>
    );
}

