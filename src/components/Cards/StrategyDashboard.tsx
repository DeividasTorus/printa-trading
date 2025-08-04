import React, { useState, useEffect } from 'react';
import DailyPnLChart from '../Charts/DailyPnLChart';
import StatsSummary from './StatsSummary';
import TortoiseIcon from '../../assets/Img/tortoise.svg?react';
import HareIcon from '../../assets/Img/hare.svg?react';
import BoltCircleIcon from '../../assets/Img/bolt.circle.svg?react';
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
    const [selectedRange, setSelectedRange] = useState({
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
        <div className="px-4 md:px-10 mt-6 overflow-x-hidden w-full">
            <div className="flex justify-between items-end mb-0 flex-wrap gap-2">
                {/* Strategy Buttons - now horizontally scrollable on mobile */}
                {/* Strategy Buttons */}
                <div className="grid grid-cols-3 gap-2 w-full md:flex md:space-x-4 md:gap-0 md:w-auto">
                    {(['Comfortable', 'Modest', 'Aggressive'] as Strategy[]).map((s) => {
                        const Icon = strategyIcons[s];
                        const isActive = strategy === s;

                        return (
                            <button
                                key={s}
                                className={`w-full px-1 md:px-4 py-2 md:py-4 rounded-t-xl text-sm font-medium flex items-center justify-center space-x-1 md:space-x-2 ${isActive ? 'bg-white text-[#480090]' : 'bg-gray-100 text-gray-400'
                                    }`}
                                onClick={() => setStrategy(s)}
                            >
                                <Icon
                                    className={`w-5 h-4 md:w-10 md:h-5 ${isActive ? 'text-[#480090]' : 'text-gray-400'}`}
                                    fill="currentColor"
                                />
                                <span>
                                    <span className="block md:inline">{s}</span>
                                    <span className="hidden md:inline">&nbsp;Strategy</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Desktop/Tablet Date Picker */}
                <div className="hidden md:inline-block relative text-left">
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

            <div className="bg-white rounded-tl-none rounded-tr-xl rounded-b-xl p-4 flex flex-wrap gap-4 overflow-x-hidden">
                <div className="flex-1 min-w-[300px]">
                    {/* Mobile-only header row with title and calendar */}
                    <div className="flex justify-between items-center mb-2 md:hidden">
                        <h2 className="text-base font-semibold text-gray-700">Daily PnL</h2>
                        <div className="relative">
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className="relative text-[#9F9F9F] py-1 px-2 border rounded-md text-sm bg-white hover:bg-gray-50"
                            >
                                <span>{displayRange}</span>
                                <svg
                                    className="absolute right-2 top-1.5 w-4 h-4 text-[#9F9F9F] pointer-events-none"
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

                    <DailyPnLChart strategy={strategy} data={data} />
                </div>
                <div className="w-full mt-5 sm:mt-0 sm:w-[100%] md:w-[48%] lg:w-[42%] min-w-[300px]">
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






