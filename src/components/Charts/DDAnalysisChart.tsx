import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

type Trade = {
  date: Date;
  pnl: number;
};

type Props = {
  trades: Trade[];
  initialCapital: number;
  stopAmount: number;
  stopType: 'absolute' | 'relative';
};

const DDAnalysisChart: React.FC<Props> = ({ trades, initialCapital, stopAmount, stopType }) => {
  const { dollarDrawdown, stopLine } = useMemo(() => {
    let equity = initialCapital;
    let peak = initialCapital;

    const drawdowns: number[] = [];
    const stopCurve: number[] = [];

    for (const trade of trades) {
      equity += trade.pnl;
      if (equity > peak) peak = equity;

      const dd = peak - equity;
      drawdowns.push(dd);

      const stopLevel = stopType === 'absolute' ? stopAmount : stopAmount;
      stopCurve.push(stopLevel);
    }

    return { dollarDrawdown: drawdowns, stopLine: stopCurve };
  }, [trades, initialCapital, stopAmount, stopType]);

  const data = {
    labels: trades.map((_, i) => `${i + 1}`),
    datasets: [
      {
        label: 'Drawdown from Peak ($)',
        data: dollarDrawdown,
        borderColor: '#8b5cf6', // Tailwind purple-500
        backgroundColor: 'rgba(139, 92, 246, 0.15)', // Light fill
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: 'Stop Level ($)',
        data: stopLine,
        borderColor: '#ef4444', // Tailwind red-500
        borderDash: [6, 6],
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#374151', // Tailwind gray-700
          usePointStyle: true
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function (ctx: any) {
            const val = ctx.parsed.y;
            return `${ctx.dataset.label}: $${val.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#4b5563' }, // Tailwind gray-600
        title: {
          display: true,
          text: 'Trade Number',
          color: '#4b5563'
        }
      },
      y: {
        ticks: {
          color: '#4b5563',
          callback: function (val: any) {
            return `$${val}`;
          }
        },
        title: {
          display: true,
          text: 'Drawdown ($)',
          color: '#4b5563'
        }
      }
    }
  };

  return (
    <div className="w-full h-[375px] bg-white p-4 rounded-xl shadow">
      <Line data={data} options={options} />
    </div>
  );
};

export default DDAnalysisChart;



