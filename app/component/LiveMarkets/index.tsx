import { getLiveMarkets } from '@/app/action/LiveMarkets/get-live-markets';
import { LiveMarket } from '@/app/types/liveMarket';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Props {
  setFromCurrency: Dispatch<SetStateAction<string>>;
  setToCurrency: Dispatch<SetStateAction<string>>;
}

export function LiveMarkets({ setFromCurrency, setToCurrency }: Props) {
  const [data, setData] = useState<LiveMarket>([]);

  useEffect(() => {
    async function getData() {
      const dados = await getLiveMarkets();

      setData(dados);
    }

    getData();
  }, []);
  return (
    <div className='h-12 w-full shrink-0'>
      <div
        className='h-full flex flex-nowrap overflow-x-auto overflow-y-hidden divide-x divide-neutral-500 
                    scrollbar-none [-ms-overflow-style:none] 
                    [&::-webkit-scrollbar]:hidden'
      >
        <div className='flex-[0_0_auto] bg-lime-500 text-neutral-900 text-xs font-medium py-3 px-4 flex items-center space-x-1'>
          <div className='w-1.5 h-1.5 rounded-full bg-neutral-900'></div>
          <h1 className='whitespace-nowrap'>LIVE MARKETS</h1>
        </div>

        {data.map(market => {
          const key = market.from + '-' + market.to;
          return (
            <div
              key={key}
              className='flex-[0_0_auto] min-w-35 max-w-55 bg-neutral-700 py-3 px-4 flex items-center gap-2.5 cursor-pointer hover:bg-neutral-600'
              onClick={() => {
                setFromCurrency(market.from)
                setToCurrency(market.to)
              }}
            >
              <h2 className='text-xs text-neutral-200'>
                {market.from}/{market.to}
              </h2>
              <h2 className='text-xs text-neutral-50 font-medium'>
                {market.rate.toFixed(2)}
              </h2>
              <h2
                className={`text-xs flex items-center gap-1 ${market.changePercent > 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {market.changePercent >= 0 ? '▲ +' : '▼ '}
                {market.changePercent.toFixed(2)}%
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
