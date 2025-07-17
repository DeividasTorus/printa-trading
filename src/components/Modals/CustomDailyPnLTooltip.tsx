import React from 'react';

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string | number;
};

export const CustomDailyPnLTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const profit = data.profit;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 text-sm text-gray-800 max-w-xs border border-gray-200">
      <div className="mb-1">
        <span className="font-medium text-[#480090]">PnL:</span>{' '}
        <span className="font-medium">
          {profit.toLocaleString(undefined, { minimumFractionDigits: 1 })} ({data.trades ?? 4})
        </span>
      </div>
      <div className="mb-1">
        <span className="text-green-600">Profit:</span>{' '}
        <span>
          {profit >= 0 ? profit.toLocaleString(undefined, { minimumFractionDigits: 1 }) : 0} ({data.trades ?? 4})
        </span>
      </div>
      <div className="mb-1">
        <span className="text-red-500">Loss:</span>{' '}
        <span>{profit < 0 ? profit.toLocaleString(undefined, { minimumFractionDigits: 1 }) : 0} (0)</span>
      </div>
      <div className="mt-2 text-gray-400">Profitable trades: 100%</div>
      <div className='text-gray-400'>Risk/reward ratio: -</div>
      <div className='text-gray-400'>Sharpe ratio: 1.11</div>
      <div className="text-xs text-gray-400 mt-2">Monday, May {label}</div>
    </div>
  );
};
