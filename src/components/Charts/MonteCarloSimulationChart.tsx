import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Metric = { label: string; value: string; change: string };
type YearOverview = { year: string; pnl: number; metrics: Metric[] };

function generateSimulations(baseData: YearOverview[], paths = 5) {
  const simulations: any[][] = Array.from({ length: paths }, () => []);
  baseData.forEach((point, idx) => {
    for (let p = 0; p < paths; p++) {
      const variation = point.pnl * (Math.random() * 0.3 - 0.15); // ±15%
      const prev = idx === 0 ? 0 : simulations[p][idx - 1]?.value || 0;
      simulations[p].push({ year: point.year, value: prev + point.pnl + variation });
    }
  });
  return simulations;
}

export default function MonteCarloSimulationChart({ data }: { data: YearOverview[] }) {
  const simulations = generateSimulations(data);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-md font-semibold mb-4">Monte Carlo Simulations</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" type="category" allowDuplicatedCategory={false} />
          <YAxis />
          <Tooltip />
          {simulations.map((sim, idx) => (
            <Line
              key={idx}
              type="monotone"
              data={sim}
              dataKey="value"
              stroke={`hsl(${idx * 50}, 70%, 50%)`}
              dot={false}
              strokeWidth={1}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

