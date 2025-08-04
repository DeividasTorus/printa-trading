import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Metric = { label: string; value: string; change: string };
type YearOverview = { year: string; pnl: number; metrics: Metric[] };

// Simulation logic for 3 paths
function generateSimulations(baseData: YearOverview[]) {
  const variationLevels = [0.05, 0.15, 0.3]; // Conservative, Modest, Aggressive
  const paths = 3;
  const simulations: any[][] = Array.from({ length: paths }, () => []);

  baseData.forEach((point, idx) => {
    for (let p = 0; p < paths; p++) {
      const variation = point.pnl * (Math.random() * variationLevels[p] * 2 - variationLevels[p]);
      const prev = idx === 0 ? 0 : simulations[p][idx - 1]?.value || 0;
      simulations[p].push({
        year: point.year,
        value: prev + point.pnl + variation,
      });
    }
  });

  return simulations;
}

// Custom legend with spacing and dot icons
const CustomLegend = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingTop: 20 }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9F9F9F'  }}>
      <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%', marginRight: 5}}></div>
      Conservative
    </span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9F9F9F'  }}>
      <div style={{ width: 10, height: 10, background: '#facc15', borderRadius: '50%', marginRight: 5}}></div>
      Modest
    </span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#9F9F9F' }}>
      <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%', marginRight: 5 }}></div>
      Aggressive
    </span>
  </div>
);

export default function MonteCarloSimulationChart({ data }: { data: YearOverview[] }) {
  const simulations = generateSimulations(data);
  const legendColors = ['#22c55e', '#facc15', '#ef4444']; // Green, Yellow, Red

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-md font-semibold mb-4">Monte Carlo Simulation</h2>
      <ResponsiveContainer width="100%" height={360}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tickMargin={15} type="category" allowDuplicatedCategory={false} />
          <YAxis tickMargin={10} />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          {simulations.map((sim, idx) => (
            <Line
              key={idx}
              type="monotone"
              data={sim}
              dataKey="value"
              stroke={legendColors[idx]}
              dot={false}
              strokeWidth={1.5}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}




