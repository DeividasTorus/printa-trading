// components/Charts/CumulativePnLChart.tsx
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

interface PnLData {
  year: string;
  pnl: number;
}

interface Trade {
  date: Date;
  pnl: number;
}

interface Props {
  pnlData: PnLData[]; // from filtered mockOverview
  trades: Trade[];    // mockTrades for drawdown
}

export default function CumulativePnLChart({ pnlData, trades }: Props) {
  // Convert trades to cumulative drawdown per year
  const drawdownByYear = useMemo(() => {
    const sorted = [...trades].sort((a, b) => a.date.getTime() - b.date.getTime());
    let cumulative = 0;
    let peak = 0;
    const yearly: Record<string, { cumulative: number; drawdown: number }> = {};

    for (const { date, pnl } of sorted) {
      cumulative += pnl;
      peak = Math.max(peak, cumulative);
      const year = date.getFullYear().toString();
      const drawdown = parseFloat((peak - cumulative).toFixed(2));

      if (!yearly[year]) {
        yearly[year] = { cumulative, drawdown };
      } else {
        yearly[year].cumulative = cumulative;
        yearly[year].drawdown = drawdown;
      }
    }

    return yearly;
  }, [trades]);

  // Combine pnlData with drawdown data
  const combinedData = useMemo(() => {
    return pnlData.map(({ year, pnl }) => ({
      year,
      cumulative: pnl,
      drawdown: drawdownByYear[year]?.drawdown || 0,
    }));
  }, [pnlData, drawdownByYear]);

  const formatTick = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
    return value.toString();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-md font-semibold mb-4">Cumulative PnL With Trailing Drawdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 12 }} tickMargin={10} />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={formatTick}
            tickMargin={10}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#36BFFA', fontSize: 12 }}
            tickFormatter={formatTick}
            tickMargin={10}
          />
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ paddingTop: 20, fontSize: 12, color: '#6B7280', textAlign: 'center' }}
          />
          <Bar
            yAxisId="left"
            dataKey="cumulative"
            name="Cumulative PnL"
            fill="#480090"
            radius={[4, 4, 0, 0]}
            barSize={32}
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












