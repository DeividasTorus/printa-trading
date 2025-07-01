import React from 'react';
import { FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import TotalPlIcon from '../../assets/Img/totalPlIcon.png'
import ArrowUpIcon from '../../assets/Img/arrowUp.png'
import ArrowRise from '../../assets/Img/ArrowRise.png'

export type Stat = {
  [key: string]: string | number;
};

export type StatsSummaryProps = {
  title: string;
  stats: Stat;
  loading?: boolean;
  error?: string | null;
  showPieChart?: boolean;
  showCards?: boolean;
  rows?: { label: string; key: string }[];
};

const COLORS = ['#22c55e', '#ef4444']; // Green for win, Red for loss

export default function StatsSummary({
  title,
  stats,
  loading = false,
  error = null,
  showPieChart = true,
  showCards = true,
  rows = []
}: StatsSummaryProps) {
  const winPct = Number(stats.winPercentage ?? 0);
  const lossPct = 100 - winPct;

  const pieData = [
    { name: 'Win', value: winPct },
    { name: 'Loss', value: lossPct }
  ];

  return (
    <div className="p-4 text-sm max-w-3xl mx-auto">


      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-6">
            {stats.totalTrades !== undefined && (
              <p className="font-medium text-sm mb-3">
                Total Trades: <span className="font-bold">{stats.totalTrades}</span>
              </p>
            )}

            <div className="flex items-center justify-between gap-6 flex-nowrap overflow-x-auto">
              {showPieChart && (
                <div className="w-[100px] h-[100px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={30}
                        outerRadius={50}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {showPieChart && (
                <div className="flex flex-col text-sm text-gray-700 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full" />
                    Win
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full" />
                    Loss
                  </div>
                </div>
              )}
              {showCards && (
                <div className="flex gap-2 shrink-0">
                  <StatCard
                    icon={
                      <div className="bg-gray-200 rounded-full p-3 px-4 my-4 flex items-center justify-center shadow-md">
                        <img src={TotalPlIcon} alt="Total PL" className="w-3 h-5" />
                      </div>
                    }
                    label="Total PL"
                    value={stats.totalPL}
                  />
                  <StatCard
                    icon={
                      <div className="bg-green-100 rounded-full p-3 my-4 flex items-center justify-center shadow-md">
                        <img src={ArrowUpIcon} alt="Profit" className="w-6 h-6" />
                      </div>
                    }
                    label="Profit"
                    value={stats.profit}
                  />
                  <StatCard
                    icon={
                      <div className="bg-red-100 rounded-full p-3 my-4 flex items-center justify-center shadow-md">
                        <img src={ArrowRise} alt="Loss" className="w-6 h-6" />
                      </div>
                    }
                    label="Loss"
                    value={stats.loss}
                  />
                </div>
              )}


            </div>
          </div>
          <div className="bg-white border rounded-lg divide-y text-sm">
            {rows.map((row) => (
              <StatRow key={row.key} label={row.label} value={stats[row.key]} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[140px] w-[110px] rounded border bg-gray-50">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between px-4 py-3">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold">{value ?? '-'}</span>
    </div>
  );
}




