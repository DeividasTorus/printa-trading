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

type DataPoint = {
  day: number;
  profit: number;
};

type Props = {
  strategy: string;
  data: DataPoint[];
};

export default function DailyPnLChart({ strategy, data }: Props) {
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">Daily PnL - {strategy}</h2>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
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

      <div className="flex justify-center space-x-4 text-xs mt-2 text-gray-500">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-purple-800"></span>
          <span>Profit</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-purple-300"></span>
          <span>Loss</span>
        </div>
      </div>
    </div>
  );
}



