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
import YearlyPnLTooltip from '../components/Modals/YearlyPnLTooltip';
import DDAnalysisChart from '../components/Charts/DDAnalysisChart';

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

    const formatDate = (date: Date) =>
        date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                const unifiedMockData: YearOverview[] = [
                    {
                        year: '2020',
                        pnl: 100,
                        metrics: [
                            { label: 'Total PnL', value: '18200', change: '+2.0%' },
                            { label: 'Total Trades', value: '1000', change: '+1.2%' },
                            { label: 'Total Profit', value: '15000', change: '+2.5%' },
                            { label: 'Total Loss', value: '3200', change: '-1.0%' },
                            { label: 'Win %', value: '58', change: '+1.0%' },
                        ],
                    },
                    {
                        year: '2021',
                        pnl: 150,
                        metrics: [
                            { label: 'Total PnL', value: '20500', change: '+3.1%' },
                            { label: 'Total Trades', value: '1300', change: '+2.0%' },
                            { label: 'Total Profit', value: '17100', change: '+3.0%' },
                            { label: 'Total Loss', value: '3400', change: '-0.5%' },
                            { label: 'Win %', value: '60', change: '+1.5%' },
                        ],
                    },
                    {
                        year: '2022',
                        pnl: -80,
                        metrics: [
                            { label: 'Total PnL', value: '19800', change: '+2.8%' },
                            { label: 'Total Trades', value: '1200', change: '+1.8%' },
                            { label: 'Total Profit', value: '16500', change: '+2.7%' },
                            { label: 'Total Loss', value: '3300', change: '-0.8%' },
                            { label: 'Win %', value: '61', change: '+1.0%' },
                        ],
                    },
                    {
                        year: '2023',
                        pnl: 90,
                        metrics: [
                            { label: 'Total PnL', value: '22000', change: '+4.5%' },
                            { label: 'Total Trades', value: '1500', change: '+2.5%' },
                            { label: 'Total Profit', value: '18200', change: '+4.0%' },
                            { label: 'Total Loss', value: '3800', change: '-1.2%' },
                            { label: 'Win %', value: '62', change: '+1.8%' },
                        ],
                    },
                    {
                        year: '2024',
                        pnl: -40,
                        metrics: [
                            { label: 'Total PnL', value: '21300', change: '+3.6%' },
                            { label: 'Total Trades', value: '1400', change: '+2.3%' },
                            { label: 'Total Profit', value: '17900', change: '+3.5%' },
                            { label: 'Total Loss', value: '3400', change: '-1.1%' },
                            { label: 'Win %', value: '63', change: '+1.9%' },
                        ],
                    },
                    {
                        year: '2025',
                        pnl: 160,
                        metrics: [
                            { label: 'Total PnL', value: '23300', change: '+4.8%' },
                            { label: 'Total Trades', value: '1600', change: '+3.0%' },
                            { label: 'Total Profit', value: '20000', change: '+5.0%' },
                            { label: 'Total Loss', value: '3300', change: '-1.3%' },
                            { label: 'Win %', value: '64', change: '+2.0%' },
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
        metrics: item.metrics,
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

    // Simulated PnL trades for equity chart
    const mockTrades = [
        { date: new Date('2023-01-03'), pnl: -172 },
        { date: new Date('2023-01-04'), pnl: 349 },
        { date: new Date('2023-01-05'), pnl: 119 },
        { date: new Date('2023-01-09'), pnl: 185 },
        { date: new Date('2023-01-11'), pnl: -122 },
        { date: new Date('2023-01-13'), pnl: 602 },
        { date: new Date('2023-01-17'), pnl: -418 },
        { date: new Date('2023-01-18'), pnl: -126 },
        { date: new Date('2023-01-19'), pnl: 118 },
        { date: new Date('2023-01-19'), pnl: 42 },
        { date: new Date('2023-01-20'), pnl: 522 },
        { date: new Date('2023-01-23'), pnl: 358 },
        { date: new Date('2023-01-25'), pnl: 561 },
        { date: new Date('2023-01-26'), pnl: 65 },
        { date: new Date('2023-01-27'), pnl: 103 },
        { date: new Date('2023-01-31'), pnl: 534 },
        { date: new Date('2023-02-01'), pnl: -134 },
        { date: new Date('2023-02-02'), pnl: -222 },
        { date: new Date('2023-02-03'), pnl: 209 },
        { date: new Date('2023-02-06'), pnl: -210 },
        { date: new Date('2023-02-07'), pnl: 338 },
        { date: new Date('2024-02-08'), pnl: -224 },
        { date: new Date('2024-02-09'), pnl: 58 },
        { date: new Date('2024-02-13'), pnl: 103 },
        { date: new Date('2024-02-14'), pnl: -270 },
        { date: new Date('2024-02-15'), pnl: 49 },
        { date: new Date('2024-02-16'), pnl: -138 },
        { date: new Date('2024-02-17'), pnl: 142 },
        { date: new Date('2024-02-20'), pnl: -20 },
        { date: new Date('2024-02-22'), pnl: 239 },
        { date: new Date('2024-02-23'), pnl: 138 },
        { date: new Date('2024-02-24'), pnl: 116 },
        { date: new Date('2024-02-27'), pnl: 88 },
        { date: new Date('2024-03-01'), pnl: -142 },
        { date: new Date('2024-03-02'), pnl: 384 },
        { date: new Date('2024-03-03'), pnl: 121 },
        { date: new Date('2024-03-06'), pnl: 187 },
        { date: new Date('2024-03-08'), pnl: -86 },
        { date: new Date('2024-03-09'), pnl: -386 },
        { date: new Date('2024-03-13'), pnl: 153 },
        { date: new Date('2024-03-14'), pnl: 285 },
        { date: new Date('2024-03-15'), pnl: 310 },
        { date: new Date('2024-03-17'), pnl: -234 },
        { date: new Date('2025-03-21'), pnl: -108 },
        { date: new Date('2025-03-22'), pnl: 89 },
        { date: new Date('2025-03-23'), pnl: 508 },
        { date: new Date('2025-03-24'), pnl: 166 },
        { date: new Date('2025-03-27'), pnl: 138 },
        { date: new Date('2025-03-28'), pnl: 102 },
        { date: new Date('2025-03-29'), pnl: 79 },
        { date: new Date('2025-03-30'), pnl: 34 },
        { date: new Date('2025-03-31'), pnl: 103 }
    ]

    return (
        <div className="px-6 lg:px-10 py-8 bg-gray-100">
            <div className="relative mb-1 w-full flex justify-end">
                <div className="relative inline-block">
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="px-4 text-gray-500 py-2 border rounded-lg text-sm mb-1 bg-white hover:bg-gray-50"
                    >
                        {formatDate(dateRange[0].startDate!)} - {formatDate(dateRange[0].endDate!)}
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
                                    <Tooltip content={<YearlyPnLTooltip />} />
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

                    <div className="flex flex-col lg:flex-row gap-6 pt-8">
                        <div className="w-full">
                            <MonteCarloSimulationChart data={filtered} />
                        </div>
                        <div className="w-full">
                            <TradesSummary />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-gray-100 pt-8">
                        <CumulativePnLChart trades={mockTrades} />
                        <DDAnalysisChart
                            trades={mockTrades}
                            initialCapital={10000}
                            stopAmount={200}
                            stopType="relative"
                        />
                    </div>
                </>
            )}
        </div>
    );
}




