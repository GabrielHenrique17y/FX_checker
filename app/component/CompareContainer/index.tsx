import { compareCurrency } from '@/app/action/convert/compare-action';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';

interface Props {
  fromCurrency: string;
  currencies: Record<string, string>;
  amount: number;
  setToCurrency: Dispatch<SetStateAction<string>>;
}

export function CompareContainer({
  fromCurrency,
  currencies,
  amount,
  setToCurrency,
}: Props) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const currencyList = useMemo(() => {
    return Object.entries(currencies);
  }, [currencies]);

  const [compareData, setCompareData] = useState<
    Record<string, { result: number; value: number }>
  >({});

  useEffect(() => {
    async function load() {
      const responses = await Promise.all(
        Object.keys(currencies).map(async code => {
          const data = await compareCurrency(amount, fromCurrency, code);

          return [code, data] as const;
        }),
      );

      setCompareData(Object.fromEntries(responses));
    }

    load();
  }, [currencies, fromCurrency, amount]);

  const handleFavorite = (fromCurrency: string, toCurrency: string) => {
    async function saveFavorite() {
      const favoritesList = JSON.parse(
        localStorage.getItem('favorites') ?? '[]',
      );

      if (!favoritesList.includes(`${fromCurrency}-${toCurrency}`)) {
        favoritesList.push(`${fromCurrency}-${toCurrency}`);
        localStorage.setItem('favorites', JSON.stringify(favoritesList));
        setFavorites(favoritesList);
      } else {
        const updated = favoritesList.filter(
          (item: string) => item !== `${fromCurrency}-${toCurrency}`,
        );
        localStorage.setItem('favorites', JSON.stringify(updated));
        setFavorites(updated);
      }
    }

    saveFavorite();
  };

  const filteredList = currencyList.filter(([code]) => code !== fromCurrency);

  return filteredList.length === 0 ? (
    <div className='flex flex-col items-center py-10 gap-4'>
      <div className='w-3/4 flex flex-col items-center gap-4'>
        <h1 className='text-neutral-100 text-xl text-center'>
          No comparison available
        </h1>
        <span className='text-sm text-neutral-200 text-center'>
          Enter an amount in SEND above to see what your money is worth in other
          currencies.
        </span>
      </div>
    </div>
  ) : (
    <div className='bg-neutral-700 border border-neutral-600 flex flex-col gap-4 sm:gap-5 p-4 sm:p-5 rounded-lg'>
      <div className='flex flex-col gap-2.5 sm:gap-0 sm:flex-row justify-between'>
        <h1 className='text-sm text-neutral-200'>
          MULTI-CURRENCY{' '}
          <span className='text-neutral-50 font-medium'>
            {amount} FROM {fromCurrency}
          </span>
        </h1>
        <span className='text-xs text-neutral-200'>
          {filteredList.length} PAIRS
        </span>
      </div>
      <div className='flex flex-col gap-3'>
        {filteredList.map(([code, name]) => {
          const isFavorite = favorites.includes(`${fromCurrency}-${code}`);

          return (
            <div
              key={code}
              className='bg-neutral-600 border border-neutral-500 hover:border-neutral-300 rounded-lg px-3 py-3 flex gap-2.5 justify-between items-center active:border-lime-500'
              onClick={() => setToCurrency(code)}
            >
              <div className='flex gap-2.5'>
                <div className='flex items-center'>
                  <Image
                    src={`/assets/images/flags/${code.toLowerCase()}-flag.png`}
                    alt={`${name} flag`}
                    width={24}
                    height={24}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className='text-sm text-neutral-50'>{code}</span>
                  <span className='text-xs text-neutral-200'>{name}</span>
                </div>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='flex flex-col gap-1.5 items-end'>
                  <span className='text-sm text-neutral-50'>
                    {compareData[code]?.result.toFixed(2) ?? '...'}
                  </span>
                  <span className='text-xs text-neutral-200'>
                    @ {compareData[code]?.value ?? '...'}
                  </span>
                </div>
                <div
                  className={`bg-neutral-600 hover:bg-neutral-500 border p-2 flex items-center justify-center gap-2 rounded-lg cursor-pointer ${isFavorite ? 'border-lime-500' : 'border-neutral-500 '}`}
                  onClick={() => handleFavorite(fromCurrency, code)}
                >
                  {isFavorite ? (
                    <BsStarFill className='text-lime-500' />
                  ) : (
                    <BsStar className='text-neutral-50' />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
