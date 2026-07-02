import Image from 'next/image';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

interface Props {
  value: string;
  value2: string;
  setValue: Dispatch<SetStateAction<string>>;
  currencies: Record<string, string>;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export function CurrencyPicker({
  value,
  value2,
  setValue,
  currencies,
  isVisible,
  setIsVisible,
  setVisible,
}: Props) {
  const [search, setSearch] = useState('');

  const popular = ['USD', 'EUR', 'GBP'];

  const list = useMemo(() => {
    return Object.entries(currencies).filter(([code, name]) => {
      const q = search.toLowerCase();
      return code.toLowerCase().includes(q) || name.toLowerCase().includes(q);
    });
  }, [search, currencies]);

  const popularFiltered = popular.filter(code => code !== value2);
  const filteredList = list.filter(([code]) => code !== value2);

  return (
    <div className='relative h-10 flex items-center'>
      <div
        className='px-2.5 lg:px-4 py-2.5 flex items-center gap-2 bg-neutral-500 hover:bg-neutral-400 border border-neutral-400 cursor-pointer rounded-lg active:border-lime-500'
        onClick={() => {
          setVisible(false);
          setIsVisible(!isVisible);
        }}
      >
        <Image
          src={`/assets/images/flags/${value.toLowerCase()}-flag.png`}
          alt={`${currencies[value]} flag`}
          width={20}
          height={20}
        />
        <span className='text-sm text-neutral-50'>{value}</span>
        <span className='text-sm text-neutral-50'>
          <Image
            src={`/assets/images/icon-chevron-down.svg`}
            alt='check icon'
            width={12}
            height={12}
          />
        </span>
      </div>

      <div
        className={`bg-neutral-600 rounded-lg border border-neutral-400 absolute flex-col top-12 right-0 w-73.75 sm:w-94 p-2 gap-2.5 z-10 ${
          isVisible ? 'flex' : 'hidden'
        }`}
      >
        <div className='border border-neutral-200 flex items-center p-3 gap-4 rounded-lg focus-within:border-lime-500'>
          <BiSearch className='text-neutral-50' />
          <input
            className='focus:outline-0 text-xs text-neutral-200'
            placeholder='Search currencies...'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div>
          <div className='flex justify-between border-b border-neutral-500 p-2'>
            <span className='text-xs text-neutral-200'>POPULAR</span>
          </div>

          {popularFiltered.map(code => (
            <div
              key={code}
              onClick={() => setValue(code)}
              className='px-2 py-3 flex gap-3 items-center border border-transparent hover:border-neutral-200 rounded-lg cursor-pointer active:border-lime-500'
            >
              <Image
                src={`/assets/images/flags/${code.toLowerCase()}-flag.png`}
                alt={`${currencies[code]} flag`}
                width={20}
                height={20}
              />
              <span className='text-sm text-neutral-50'>{code}</span>
              <span className='text-xs text-neutral-200'>
                {currencies[code]}
              </span>
              {code === value && (
                <Image
                  src={'/assets/images/icon-check.svg'}
                  alt='check icon'
                  width={12}
                  height={12}
                />
              )}
            </div>
          ))}
        </div>

        <div>
          <div className='flex justify-between border-b border-neutral-500 p-2'>
            <span className='text-xs text-neutral-200'>ALL CURRENCIES</span>
            <span className='text-xs text-neutral-200'>
              {filteredList.length}
            </span>
          </div>

          <div className='max-h-85 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-400'>
            {filteredList.map(([code, name]) => (
              <div
                key={code}
                onClick={() => setValue(code)}
                className='px-2 py-3 flex gap-3 items-center border border-transparent hover:border-neutral-200 rounded-lg cursor-pointer active:border-lime-500'
              >
                <Image
                  src={`/assets/images/flags/${code.toLowerCase()}-flag.png`}
                  alt={`${name} flag`}
                  width={20}
                  height={20}
                />
                <span className='text-sm text-neutral-50'>{code}</span>
                <span className='text-xs text-neutral-200'>{name}</span>

                {code === value && (
                  <Image
                    src='/assets/images/icon-check.svg'
                    alt='check icon'
                    width={12}
                    height={12}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
