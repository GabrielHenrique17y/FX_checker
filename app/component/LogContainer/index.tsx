import { LogType } from '@/app/types/logs';
import { formatDistanceToTime } from '@/app/utils/formatDistanceToTime';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface Props {
  logs: LogType[];
  setLogs: Dispatch<SetStateAction<LogType[]>>;
  setFromCurrency: Dispatch<SetStateAction<string>>;
  setToCurrency: Dispatch<SetStateAction<string>>;
}

export function LogContainer({
  logs,
  setLogs,
  setFromCurrency,
  setToCurrency,
}: Props) {
  useEffect(() => {
    async function getLogList() {
      const logList = JSON.parse(localStorage.getItem('logs') ?? '[]');

      setLogs(logList);
    }

    getLogList();
  }, [setLogs]);

  const removeLog = (timeToRemove: string) => {
    async function removeFromList() {
      const updated = logs.filter(
        (item: LogType) => item.time !== timeToRemove,
      );

      localStorage.setItem('logs', JSON.stringify(updated));
      setLogs(updated);
    }

    removeFromList();
  };

  const removeAllLogs = () => {
    async function removeFromList() {
      const updated: LogType[] = [];

      localStorage.setItem('logs', JSON.stringify(updated));
      setLogs(updated);
    }

    removeFromList();
  };

  return logs.length === 0 ? (
    <div className='flex flex-col items-center py-10 gap-4'>
      <div className='w-3/4 flex flex-col items-center gap-4'>
        <h1 className='text-neutral-100 text-xl text-center'>No conversions logged yet</h1>
        <span className='text-sm text-neutral-200 text-center'>
          Every conversion is recorded here automatically when you tap LOG
          CONVERSION. Your log is private to this session and this browser.
        </span>
      </div>
    </div>
  ) : (
    <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-5 p-5 rounded-lg'>
      <div className='flex flex-col sm:flex-row justify-between'>
        <h1 className='text-sm text-neutral-50'>CONVERSION LOG</h1>
        <div className='flex gap-4 items-center justify-between sm:justify-center'>
          <span className='text-xs text-neutral-200'>{logs.length} LOGGED</span>
          <button
            className='bg-neutral-600 rounded-lg border border-neutral-400 text-xs text-neutral-200 px-3 py-2 cursor-pointer hover:bg-neutral-500'
            onClick={() => removeAllLogs()}
          >
            CLEAR ALL
          </button>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {logs.map(log => {
          const { time, fromCurrency, toCurrency, fromValue, toValue } = log;

          return (
            <div
              key={`${fromCurrency}-${toCurrency} ${time}`}
              className='bg-neutral-600 border border-neutral-500 rounded-lg p-4 flex gap-5 justify-between items-center hover:border-neutral-300 active:border-lime-500'
              onClick={() => {
                setFromCurrency(fromCurrency);
                setToCurrency(toCurrency);
              }}
            >
              <div className='flex flex-col sm:flex-row sm:gap-2'>
                <span className='text-sm text-neutral-200'>
                  {formatDistanceToTime(time)}
                </span>
                <span className='text-sm text-neutral-50 flex items-center gap-2'>
                  {fromCurrency}{' '}
                  <Image
                    src={'/assets/images/icon-arrow-right.svg'}
                    alt='arrow-right icon'
                    width={11}
                    height={11}
                  />{' '}
                  {toCurrency}
                </span>
              </div>
              <div className='flex items-center gap-2.5 sm:gap-5'>
                <div className='flex flex-col sm:flex-row sm:gap-5 items-center'>
                  <span className='text-neutral-100'>
                    {Number(fromValue).toFixed(2)}
                  </span>
                  <span className='text-lime-500'>
                    {Number(toValue).toFixed(2)}
                  </span>
                </div>
                <div
                  className='bg-neutral-600 border border-neutral-500 p-2 flex items-center justify-center gap-2 rounded-lg cursor-pointer hover:bg-neutral-500'
                  onClick={() => removeLog(time)}
                >
                  <Image
                    src={'/assets/images/icon-delete.svg'}
                    alt='delete icon'
                    width={16}
                    height={16}
                  />{' '}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
