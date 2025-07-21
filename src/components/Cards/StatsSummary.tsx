import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps
} from 'recharts';

import TotalPlIcon from '../../assets/Img/totalPlIcon.png';
import ArrowUpIcon from '../../assets/Img/arrowUp.png';
import ArrowRise from '../../assets/Img/ArrowRise.png';

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
  selectedDate?: string;
  screenType?: 'strategy' | 'yearly';
};

const COLORS = ['#4BCD18', '#FF5D5D'];

const renderInsideSliceLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: PieLabelRenderProps) => {
  const RADIAN = Math.PI / 180;
  const cxNum = Number(cx);
  const cyNum = Number(cy);
  const outerRadiusNum = Number(outerRadius);
  const innerRadiusNum = Number(innerRadius ?? 0);

  const radius = (outerRadiusNum + innerRadiusNum) / 2;
  const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
  const y = cyNum + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {((percent ?? 0) * 100).toFixed(0)}%
    </text>
  );
};

export default function StatsSummary({
  title,
  stats,
  loading = false,
  error = null,
  showPieChart = true,
  showCards = true,
  rows = [],
  selectedDate,
  screenType
}: StatsSummaryProps) {
  const winPct = Number(stats.winPercentage ?? 0);
  const lossPct = 100 - winPct;

  const pieData = [
    { name: 'Win', value: winPct },
    { name: 'Loss', value: lossPct }
  ];

  const formattedDate =
    selectedDate &&
    new Date(selectedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });

  return (
    <div className="px-4 sm:px-8 py-2 border-l-[3px] text-sm w-full overflow-x-hidden">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-6">
            {screenType === 'strategy' && (
              <h1 className="font-medium text-xl mb-4">
                {formattedDate ? `${formattedDate} Statistics` : 'Statistics'}
              </h1>
            )}
            {screenType === 'yearly' && (
              <h1 className="font-medium text-xl mb-6">Total Overview</h1>
            )}

            <div className="flex flex-wrap items-start justify-start gap-6">
              <div>
                {stats.totalTrades !== undefined && (
                  <p className="mb-4 text-[16px]">
                    Total Trades: <span className="font-bold">{stats.totalTrades}</span>
                  </p>
                )}
                <div className='flex'>
                  <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
                    <div className="w-[100px] h-[100px] shrink-0">
                      {showPieChart && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              outerRadius={50}
                              dataKey="value"
                              stroke="none"
                              label={renderInsideSliceLabel}
                              labelLine={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>
                  {showPieChart && (
                    <div className="flex flex-col text-sm text-gray-700 shrink-0 ml-5 mt-6">
                      <div className="flex items-center gap-2 mb-1 text-[#9F9F9F]">
                        <span className="w-3 h-3 bg-green-500 rounded-full" />
                        Win
                      </div>
                      <div className="flex items-center gap-2 text-[#9F9F9F]">
                        <span className="w-3 h-3 bg-red-400 rounded-full" />
                        Loss
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex flex-wrap gap-2">
                {showCards && (
                  <>
                    <StatCard
                      icon={
                        <div className="rounded-full border-2 border-black p-3 px-4 my-4 flex items-center justify-center">
                          <img src={TotalPlIcon} alt="Total PL" className="w-3 h-5" />
                        </div>
                      }
                      label="Total PL"
                      value={stats.totalPL}
                    />
                    <StatCard
                      icon={
                        <div className="bg-green-100 rounded-full p-3 my-4 flex items-center justify-center">
                          <img src={ArrowUpIcon} alt="Profit" className="w-6 h-6" />
                        </div>
                      }
                      label="Profit"
                      value={stats.profit}
                    />
                    <StatCard
                      icon={
                        <div className="bg-red-100 rounded-full p-3 my-4 flex items-center justify-center">
                          <img src={ArrowRise} alt="Loss" className="w-6 h-6" />
                        </div>
                      }
                      label="Loss"
                      value={stats.loss}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rows */}
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
    <div className="flex flex-col items-center justify-center mt-2 h-[150px] w-[120px] rounded border-[3px] shrink-0">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between py-3 px-[20px] mx-4">
      <span className="text-gray-700 font-semibold">{label}</span>
      <span className="font-bold">{value ?? '-'}</span>
    </div>
  );
}


