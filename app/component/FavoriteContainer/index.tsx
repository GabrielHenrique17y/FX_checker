import { getIntervalValueData } from '@/app/action/getIntervalValueData/get-interval-value-data-action';
import { ChartDataType } from '@/app/types/chartData';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsStarFill } from 'react-icons/bs';

interface Props {
  favorites: string[];
  setFavorites: Dispatch<SetStateAction<string[]>>;
  setFromCurrency: Dispatch<SetStateAction<string>>;
  setToCurrency: Dispatch<SetStateAction<string>>;
}

export function FavoriteContainer({
  favorites,
  setFavorites,
  setFromCurrency,
  setToCurrency,
}: Props) {
  const [conversionData, setConversionData] = useState<
    Record<string, ChartDataType[]>
  >({});

  useEffect(() => {
    let mounted = true;

    async function loadValues() {

      if (!favorites.length) {
        setConversionData({});
        return;
      }

      const responses = await Promise.allSettled(
        favorites.map(async pair => {

          const [from, to] = pair.split('-');

          return {
            pair,
            data: await getIntervalValueData(from, to, '5D'),
          };
        }),
      );

      const result: Record<string, ChartDataType[]> = {};

      responses.forEach(response => {
        if (response.status === 'fulfilled') {
          result[response.value.pair] = response.value.data;
        }
      });

      if (mounted) {
        setConversionData(result);
      }
    }

    loadValues();

    return () => {
      mounted = false;
    };
  }, [favorites]);

  useEffect(() => {
    const favoritesList = JSON.parse(localStorage.getItem('favorites') ?? '[]');

    setFavorites(favoritesList);
  }, [setFavorites]);

  const removeFavorite = (pair: string) => {
    const updated = favorites.filter(item => item !== pair);

    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  return favorites.length === 0 ? (
    <div className='flex flex-col items-center py-10 gap-4'>
      <div className='w-3/4 flex flex-col items-center gap-4'>
        <h1 className='text-neutral-100 text-xl text-center'>
          No pinned pairs yet
        </h1>

        <span className='text-sm text-neutral-200 text-center'>
          Pin a pair to track its rate here. Tap the star icon on any conversion
          or comparison row.
        </span>
      </div>
    </div>
  ) : (
    <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-4 sm:gap-5 p-4 sm:p-5 rounded-lg'>
      <div className='flex justify-between'>
        <h1 className='text-sm text-neutral-50'>PINNED PAIRS</h1>

        <span className='text-xs text-neutral-200'>
          {favorites.length} FAVORITES
        </span>
      </div>

      <div className='flex flex-col gap-3'>
        {favorites.map(pair => {
          const [fromCurrency, toCurrency] = pair.split('-');

          const data = conversionData[pair] ?? [];

          const openValue = data.at(-2)?.value ?? 0;
          const lastValue = data.at(-1)?.value ?? 0;

          const percentChange =
            openValue === 0
              ? 0
              : ((lastValue - openValue) / openValue) * 100;

          return (
            <div
              key={pair}
              className='bg-neutral-600 border border-neutral-500 rounded-lg px-4 py-3 flex justify-between items-center hover:border-neutral-300 active:border-lime-500'
              onClick={() => {
                setFromCurrency(fromCurrency);
                setToCurrency(toCurrency);
              }}
            >
              <span className='text-sm text-neutral-50 flex items-center gap-2'>
                {fromCurrency}

                <Image
                  src='/assets/images/icon-arrow-right.svg'
                  alt='arrow-right icon'
                  width={11}
                  height={11}
                />

                {toCurrency}
              </span>

              <div className='flex items-center gap-5'>
                <div className='flex flex-col items-end gap-1.5'>
                  <span className='text-sm text-neutral-50'>
                    {lastValue.toFixed(4)}
                  </span>

                  <span
                    className={`text-xs ${
                      percentChange >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {percentChange >= 0 ? '▲ +' : '▼ '}
                    {percentChange.toFixed(2)}%
                  </span>
                </div>

                <button
                  type='button'
                  className='bg-neutral-600 border border-lime-500 p-2 rounded-lg cursor-pointer'
                  onClick={e => {
                    e.stopPropagation();
                    removeFavorite(pair);
                  }}
                >
                  <BsStarFill className='text-lime-500' />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
