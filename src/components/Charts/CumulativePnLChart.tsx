import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface YearPnL {
  year: string;
  pnl: number;
}

interface Props {
  data: YearPnL[];
}

export default function CumulativePnLChart({ data }: Props) {
  const chartData = data.reduce((acc: { year: string; cumulative: number }[], curr, idx) => {
    const prev = idx === 0 ? 0 : acc[idx - 1].cumulative;
    const cumulative = prev + curr.pnl;
    acc.push({ year: curr.year, cumulative });
    return acc;
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-md font-semibold mb-4">Cumulative PnL</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="cumulative"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


