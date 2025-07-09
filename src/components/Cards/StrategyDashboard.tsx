import React, { useState, useEffect } from 'react';
import DailyPnLChart from '../Charts/DailyPnLChart';
import StatsSummary from './StatsSummary';
import TortoiseIcon from '../../assets/Img/tortoise.png';
import HareIcon from '../../assets/Img/hare.png';
import BoltCircleIcon from '../../assets/Img/boltCircle.png';
import { Calendar } from 'react-date-range';
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
    const [selectedDate, setSelectedDate] = useState('2025-05-01');
    const [showCalendar, setShowCalendar] = useState(false);
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

                await new Promise((r) => setTimeout(r, 500));
                setStats(mockData[selectedDate] || {});
            } catch (err) {
                setError('Failed to load stats');
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [selectedDate]);

    return (
        <div className="px-10 mt-6">
            {/* Strategy Filter & Date Picker */}
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
                                    strategyIcons[s].match(/\.(png|jpe?g|svg)$/i) ? (
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
                        className="px-4 text-gray-500 py-2 border rounded-lg text-sm mb-1 bg-white hover:bg-gray-50"
                    >
                        {format(new Date(selectedDate), 'yyyy-MM-dd')}
                    </button>

                    {showCalendar && (
                        <div className="absolute right-0 z-50 mt-2 bg-white shadow-lg rounded-xl p-3">
                            <Calendar
                                date={new Date(selectedDate)}
                                onChange={(date) => {
                                    setSelectedDate(format(date, 'yyyy-MM-dd'));
                                    setShowCalendar(false);
                                }}
                                color="#8b5cf6"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-tl-none rounded-tr-xl rounded-b-xl shadow-md p-4 flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <DailyPnLChart strategy={strategy} data={data} />
                </div>
                <div className="w-full lg:w-[40%]">
                    <StatsSummary
                        title={`Stats for ${selectedDate}`}
                        selectedDate={selectedDate}
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

