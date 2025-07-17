import React from 'react';

type Metric = {
    label: string;
    value: string;
    change: string;
};

type PayloadItem = {
    payload: {
        year: string;
        pnl: number;
        metrics?: Metric[];
    };
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: PayloadItem[];
    label?: string;
};

const YearlyPnLTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length && payload[0].payload) {
        const data = payload[0].payload;

        return (
            <div className="bg-white text-sm p-3 rounded shadow border border-gray-300 max-w-[240px]">
                <p><strong>Year:</strong> {data.year}</p>
                <p><strong>PnL:</strong> {data.pnl.toLocaleString()}</p>
                {data.metrics?.map((metric: Metric) => (
                    <p key={metric.label}>
                        <strong>{metric.label}:</strong> {metric.value} ({metric.change})
                    </p>
                ))}
            </div>
        );
    }

    return null;
};

export default YearlyPnLTooltip;
