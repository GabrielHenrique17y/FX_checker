import { Period } from '@/app/types/period';
import { PeriodContainer } from '../PeriodContainer';
import { Chart } from '../Chart';
import { ChartDataType } from '@/app/types/chartData';
import { useEffect, useState } from 'react';
import { getIntervalValueData } from '@/app/action/getIntervalValueData/get-interval-value-data-action';

interface Props {
  fromCurrency: string;
  toCurrency: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString + 'T00:00:00Z');

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    month: 'short',
    day: 'numeric',
  });

  return formatter.format(date).toUpperCase() + ' CET';
};

export function HistoryContainer({ fromCurrency, toCurrency }: Props) {
  const [periodSelected, setPeriodSelected] = useState<Period>('1M');
  const [chartData, setChartData] = useState<ChartDataType[]>([]);
  const openValue = chartData[0]?.value ?? 0;
  const lastValue = chartData.at(-1)?.value ?? 0;

  const changeValue = lastValue - openValue;

  const percentChangeValue =
    openValue !== 0 ? (changeValue / openValue) * 100 : 0;

  useEffect(() => {
    async function load() {
      const data = await getIntervalValueData(
        fromCurrency,
        toCurrency,
        periodSelected,
      );
      setChartData(data);
    }
    load();
  }, [fromCurrency, toCurrency, periodSelected]);

  return chartData.length === 0 ? (
    <div className='flex flex-col items-center py-10 gap-4'>
      <div className='w-3/4 flex flex-col items-center gap-4'>
        <h1 className='text-neutral-100 text-xl text-center'>
          No chart data available
        </h1>
        <span className='text-sm text-neutral-200 text-center'>
          We couldn&apos;t load rate history for {fromCurrency}/{toCurrency}{' '}
          right now. This usually clears up in a minute.
        </span>
      </div>
    </div>
  ) : (
    <div className='flex flex-col gap-5'>
      <div className='flex flex-col xl:flex-row gap-5 xl:gap-2.5'>
        <div className='xl:w-4/5 w-full grid md:grid-cols-4 grid-cols-2 mr-4 gap-4'>
          <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-4 px-5 py-3 rounded-lg'>
            <h1 className='text-sm text-neutral-200'>OPEN</h1>
            <h2 className='text-xl text-neutral-50'>{openValue.toFixed(2)}</h2>
          </div>
          <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-4 px-5 py-3 rounded-lg'>
            <h1 className='text-sm text-neutral-200'>LAST</h1>
            <h2 className='text-xl text-neutral-50'>{lastValue.toFixed(2)}</h2>
          </div>
          <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-4 px-5 py-3 rounded-lg'>
            <h1 className='text-sm text-neutral-200'>CHANGE</h1>
            <h2
              className={`text-xl ${changeValue < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {changeValue > 0 && '+'}
              {changeValue.toFixed(2)}
            </h2>
          </div>
          <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-4 px-5 py-3 rounded-lg'>
            <h1 className='text-sm text-neutral-200'>% CHANGE</h1>
            <h2
              className={`text-xl ${percentChangeValue < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              {percentChangeValue >= 0 ? '▲' : '▼'}{' '}
              {percentChangeValue >= 0 && '+'}
              {percentChangeValue.toFixed(2)}%
            </h2>
          </div>
        </div>
        <div className='flex items-center'>
          <PeriodContainer
            selected={periodSelected}
            setSelect={setPeriodSelected}
          />
        </div>
      </div>
      <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-5 px-3 py-4 sm:p-5 rounded-lg'>
        <div className='flex justify-between items-center'>
          <h1 className='font-medium text-neutral-50'>
            {fromCurrency}/{toCurrency}
          </h1>
          <span className='text-xs text-neutral-200'>
            {lastValue} · {formatDate(chartData.at(-1)?.date ?? '')}
          </span>
        </div>
        <Chart data={chartData} />
      </div>
    </div>
  );
}
