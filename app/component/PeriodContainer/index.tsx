import { Period } from '@/app/types/period';
import { Dispatch, SetStateAction } from 'react';


interface Props {
  selected: Period;
  setSelect: Dispatch<SetStateAction<Period>>;
}

export function PeriodContainer({ selected, setSelect }: Props) {
  return (
    <ul className='flex items-center text-neutral-200 bg-neutral-700 rounded-lg h-fit'>
      <li
        className={`px-4 py-3 rounded-lg cursor-pointer border border-transparent active:border-lime-500 ${selected === '1W' && 'bg-neutral-500'}`}
        onClick={() => setSelect('1W')}
      >
        1w
      </li>
      <li
        className={`px-4 py-3 rounded-lg cursor-pointer border border-transparent active:border-lime-500 ${selected === '1M' && 'bg-neutral-500'}`}
        onClick={() => setSelect('1M')}
      >
        1m
      </li>
      <li
        className={`px-4 py-3 rounded-lg cursor-pointer border border-transparent active:border-lime-500 ${selected === '3M' && 'bg-neutral-500'}`}
        onClick={() => setSelect('3M')}
      >
        3m
      </li>
      <li
        className={`px-4 py-3 rounded-lg cursor-pointer border border-transparent active:border-lime-500 ${selected === '1Y' && 'bg-neutral-500'}`}
        onClick={() => setSelect('1Y')}
      >
        1y
      </li>
      <li
        className={`px-4 py-3 rounded-lg cursor-pointer border border-transparent active:border-lime-500 ${selected === '5Y' && 'bg-neutral-500'}`}
        onClick={() => setSelect('5Y')}
      >
        5y
      </li>
    </ul>
  );
}
