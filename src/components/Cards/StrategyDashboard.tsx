import React, { useState, useEffect } from 'react';
import DailyPnLChart from '../Charts/DailyPnLChart';
import StatsSummary from './StatsSummary';
import TortoiseIcon from '../../assets/Img/tortoise.png';
import HareIcon from '../../assets/Img/hare.png';
import BoltCircleIcon from '../../assets/Img/boltCircle.png';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const strategyIcons = {
    Comfortable: TortoiseIcon,
    Modest: HareIcon,
    Aggressive: BoltCircleIcon
};

type Strategy = keyof typeof strategyIcons;
type Stat = { [key: string]: string | number };

export default function StrategyDashboard() {
    const [strategy, setStrategy] = useState<Strategy>('Comfortable');
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedRange, setSelectedRange] = useState<{
        startDate: Date;
        endDate: Date;
    }>({
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-01')
    });
    const [data, setData] = useState<{ day: number; profit: number }[]>([]);
    const [stats, setStats] = useState<Stat>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const simulatedData = {
            Comfortable: Array.from({ length: 31 }, (_, i) => ({
                day: i + 1,
                profit: i % 2 === 0 ? 900 - i * 15 : -500 + i * 5
            })),
            Modest: Array.from({ length: 31 }, (_, i) => ({
                day: i + 1,
                profit: i % 3 === 0 ? 300 : -250
            })),
            Aggressive: Array.from({ length: 31 }, (_, i) => ({
                day: i + 1,
                profit: i % 2 === 0 ? 1200 - i * 20 : -900 + i * 10
            }))
        };

        setData(simulatedData[strategy]);
    }, [strategy]);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            setError(null);

            try {
                const mockData: Record<string, Stat> = {
                    '2025-05-01': {
                        totalTrades: 13,
                        winPercentage: 29,
                        lossPercentage: 71,
                        totalPL: '6,189',
                        profit: '13,354.75',
                        loss: '7,165.75',
                        profitPoints: '1,092.25',
                        lossPoints: '679.5',
                        profitAvg: '15.38',
                        lossAvg: '27.18',
                        largestWin: '895.5'
                    }
                };

                const key = format(selectedRange.startDate, 'yyyy-MM-dd');
                await new Promise((r) => setTimeout(r, 500));
                setStats(mockData[key] || {});
            } catch (err) {
                setError('Failed to load stats');
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [selectedRange]);

    const displayRange =
        selectedRange.startDate.toDateString() === selectedRange.endDate.toDateString()
            ? format(selectedRange.startDate, 'MMMM d, yyyy')
            : `${format(selectedRange.startDate, 'MMM d')} - ${format(selectedRange.endDate, 'MMM d')}`;

    return (
        <div className="px-10 mt-6">
            <div className="flex justify-between items-end mb-0">
                <div className="flex space-x-4">
                    {(['Comfortable', 'Modest', 'Aggressive'] as Strategy[]).map((s) => (
                        <button
                            key={s}
                            className={`px-4 py-4 rounded-t-xl text-sm font-medium flex items-center space-x-2 ${strategy === s ? 'bg-white text-[#480090]' : 'bg-gray-100 text-gray-400'
                                }`}
                            onClick={() => setStrategy(s)}
                        >
                            <span>
                                {typeof strategyIcons[s] === 'string' &&
                                    strategyIcons[s] ? (
                                    <img src={strategyIcons[s]} alt={`${s} icon`} className="w-5 h-5" />
                                ) : (
                                    strategyIcons[s]
                                )}
                            </span>
                            <span>{s} Strategy</span>
                        </button>
                    ))}
                </div>
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="relative w-[200px] text-[#9F9F9F] py-2 border rounded-lg text-sm mb-1 bg-white hover:bg-gray-50 text-center"
                    >
                        <span className="block">{displayRange}</span>
                        <svg
                            className="absolute right-3 bottom-2 w-4 h-4 text-[#9F9F9F] pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showCalendar && (
                        <div className="absolute right-0 z-50 mt-2 bg-white shadow-lg rounded-xl p-3">
                            <DateRange
                                editableDateInputs={true}
                                onChange={(item) => {
                                    const { startDate, endDate } = item.selection;
                                    if (startDate && endDate) {
                                        setSelectedRange({ startDate, endDate });
                                    }
                                }}
                                moveRangeOnFirstSelection={false}
                                ranges={[
                                    {
                                        startDate: selectedRange.startDate,
                                        endDate: selectedRange.endDate,
                                        key: 'selection',
                                        color: '#8b5cf6'
                                    }
                                ]}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-tl-none rounded-tr-xl rounded-b-xl p-4 flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <DailyPnLChart strategy={strategy} data={data} />
                </div>
                <div className="w-full lg:w-[42%]">
                    <StatsSummary
                        title={`Stats for ${format(selectedRange.startDate, 'yyyy-MM-dd')}`}
                        selectedDate={format(selectedRange.startDate, 'yyyy-MM-dd')}
                        stats={stats}
                        loading={loading}
                        error={error}
                        screenType="strategy"
                        rows={[
                            { label: 'Profit Points (*1/1)', key: 'profitPoints' },
                            { label: 'Loss Points (*1/1)', key: 'lossPoints' },
                            { label: 'Profit Avg Points (*1/1)', key: 'profitAvg' },
                            { label: 'Loss Avg Points (*1/1)', key: 'lossAvg' },
                            { label: 'Largest Win', key: 'largestWin' }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}


