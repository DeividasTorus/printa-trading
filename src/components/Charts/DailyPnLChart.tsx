import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { CustomDailyPnLTooltip } from '../Modals/CustomDailyPnLTooltip'; // Adjust path if needed

type DataPoint = {
  day: number;
  profit: number;
  trades?: number;
};

type Props = {
  strategy: string;
  data: DataPoint[];
};

export default function DailyPnLChart({ strategy, data }: Props) {
  const maxAbsProfit = Math.max(...data.map(d => Math.abs(d.profit)));

  return (
    <div className="w-full">
      <h2 className="hidden md:block text-lg font-semibold mb-2">
        Daily PnL - {strategy}
      </h2>
      {/* Desktop legend (top-right) */}
      <div className="hidden md:flex justify-center space-x-[120px] text-xs ml-[500px] mt-[-25px] mb-6 text-gray-500">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-purple-800"></span>
          <span className="text-[#9F9F9F]">Profit</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-purple-300"></span>
          <span className="text-[#9F9F9F]">Loss</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data}>
          <YAxis domain={[-maxAbsProfit, maxAbsProfit]} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={({ x, payload }) => {
              const profit = data.find(d => d.day === payload.value)?.profit ?? 0;
              const labelY = profit < 0 ? 180 : 220;

              return (
                <text
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  fill="#9F9F9F"
                  fontSize={12}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <Tooltip content={<CustomDailyPnLTooltip />} />
          <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" />
          <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.profit >= 0 ? '#480090' : '#984FE0'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex md:hidden justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center mr-16 space-x-1">
          <span className="w-2 h-2 rounded-full bg-purple-800"></span>
          <span className="text-[#9F9F9F]">Profit</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-purple-300"></span>
          <span className="text-[#9F9F9F]">Loss</span>
        </div>
      </div>
    </div>
  );
}





