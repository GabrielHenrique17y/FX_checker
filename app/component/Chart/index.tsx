'use client';

import { ChartDataType } from '@/app/types/chartData';
import { Area, XAxis, YAxis, ResponsiveContainer, AreaChart, CartesianGrid } from 'recharts';

interface Props {
  data: ChartDataType[];
}
export function Chart({ data }: Props) {
  const getTicks = (data: ChartDataType[], maxTicks = 6) => {
    if (data.length <= maxTicks) return data.map(d => d.date);
    const step = (data.length - 1) / (maxTicks - 1);
    return Array.from(
      { length: maxTicks },
      (_, i) => data[Math.round(i * step)].date,
    );
  };

  const ticks = getTicks(data, 5);

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id='gradientArea' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#CEF739' stopOpacity={0.8} />
            <stop offset='100%' stopColor='#171719' stopOpacity={0.2} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          horizontal={true} 
          strokeDasharray='1.5 5'
          stroke='#2E2E2E' 
        />

        <XAxis
          dataKey='date'
          tick={{ fill: '#9D9D9D', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          ticks={ticks}
          tickFormatter={dateStr => {
            const date = new Date(dateStr);
            return date
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              .toUpperCase();
          }}
        />

        <YAxis
          tick={{ fill: '#9D9D9D', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={value => value.toFixed(4)}
          domain={['auto', 'auto']}
          tickCount={3}
        />

        <Area
          type='linear'
          dataKey='value'
          stroke='#CEF739'
          fill='url(#gradientArea)'
          dot={false}
          activeDot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
