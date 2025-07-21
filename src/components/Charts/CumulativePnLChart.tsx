import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

interface Trade {
  date: Date;
  pnl: number;
}

interface Props {
  trades: Trade[];
}

export default function CumulativePnLChart({ trades }: Props) {
  const chartData = useMemo(() => {
    const sorted = [...trades].sort((a, b) => a.date.getTime() - b.date.getTime());

    let cumulative = 0;
    let peak = 0;
    const rawDrawdowns: number[] = [];

    // First pass: compute cumulative PnL and raw drawdowns
    const base = sorted.map(({ date, pnl }) => {
      cumulative += pnl;
      peak = Math.max(peak, cumulative);
      const drawdown = Math.max(0, +(peak - cumulative).toFixed(2));
      rawDrawdowns.push(drawdown);
      return { date, pnl, cumulative };
    });

    const maxDrawdown = Math.max(...rawDrawdowns) || 1; // avoid division by 0

    // Second pass: normalize and center drawdown between 0–2000 (centered at 1000)
    return base.map(({ date, cumulative }, i) => {
      const normalizedDrawdown = (rawDrawdowns[i] / maxDrawdown) * 2000;
      const centeredDrawdown = 1000 - normalizedDrawdown;

      return {
        dateLabel: format(date, 'MMM dd, yyyy'),
        cumulative,
        drawdown: centeredDrawdown,
      };
    });
  }, [trades]);

  const formatTick = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
    return value.toString();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-md font-semibold mb-4">Daily Cumulative PnL with Trailing Drawdown</h2>
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dateLabel"
            tick={{ fill: '#6B7280', fontSize: 11 }}
            angle={-45}
            height={70}
            tickMargin={30}
            interval={1}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={formatTick}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 2000]} // Fixed range
            allowDataOverflow={false}
            tick={{ fill: '#36BFFA', fontSize: 12 }}
            tickFormatter={formatTick}
          />
          <Tooltip />
          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 10 }} />
          <Bar
            yAxisId="left"
            dataKey="cumulative"
            name="Cumulative PnL"
            fill="#480090"
            radius={[4, 4, 0, 0]}
            barSize={12}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="drawdown"
            name="Drawdown"
            stroke="#36BFFA"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

















