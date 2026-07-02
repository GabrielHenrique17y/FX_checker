'use client';

import { getCurrencies } from './action/currencies/get-currencies-action';
import { useEffect, useState, useTransition } from 'react';
import { convertCurrency } from './action/convert/convert-action';
import { CurrencyPicker } from './component/CurrencyPicker';
import { HistoryContainer } from './component/HistoryContainer';
import { TabsMenu } from './component/TabsMenu';
import { TabsMenuType } from './types/tabsMenu';
import { CompareContainer } from './component/CompareContainer';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { FavoriteContainer } from './component/FavoriteContainer';
import { LogContainer } from './component/LogContainer';
import { LogType } from './types/logs';
import { LiaExchangeAltSolid } from 'react-icons/lia';
import { LiveMarkets } from './component/LiveMarkets';

export default function Home() {
  const [currencies, setCurrencies] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState(1000);
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [selectedTab, setSelectedTab] = useState<TabsMenuType>('History');
  const [isFavorite, setIsFavorite] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogType[]>([]);
  const [sendIsVisible, setSendIsVisible] = useState(false);
  const [convertIsVisible, setConvertIsVisible] = useState(false);

  const favoriteBtnFn = () => {
    async function saveFavorite() {
      const favoritesList = JSON.parse(
        localStorage.getItem('favorites') ?? '[]',
      );

      if (!favoritesList.includes(`${fromCurrency}-${toCurrency}`)) {
        favoritesList.push(`${fromCurrency}-${toCurrency}`);
        localStorage.setItem('favorites', JSON.stringify(favoritesList));
        setIsFavorite(true);
        setFavorites(favoritesList);
      } else {
        const updated = favoritesList.filter(
          (item: string) => item !== `${fromCurrency}-${toCurrency}`,
        );
        localStorage.setItem('favorites', JSON.stringify(updated));
        setIsFavorite(false);
        setFavorites(updated);
      }
    }

    saveFavorite();
  };

  const logBtnFn = () => {
    async function saveLog() {
      const logList = JSON.parse(localStorage.getItem('logs') ?? '[]');
      const response: LogType = {
        time: String(new Date().toISOString()),
        fromCurrency,
        toCurrency,
        fromValue: String(amount),
        toValue: String(result) ?? '0',
      };

      if (!logList.includes(response)) {
        logList.push(response);
        localStorage.setItem('logs', JSON.stringify(logList));
        setLogs(logList);
      }
    }

    saveLog();
  };

  useEffect(() => {
    async function verifyFavoriteAndLogs() {
      const favoritesList: string[] = JSON.parse(
        localStorage.getItem('favorites') ?? '[]',
      );
      const logsList: LogType[] = JSON.parse(
        localStorage.getItem('logs') ?? '[]',
      );

      if (!favoritesList.includes(`${fromCurrency}-${toCurrency}`)) {
        setIsFavorite(false);
        setFavorites(favoritesList);
      } else {
        setIsFavorite(true);
        setFavorites(favoritesList);
      }

      setLogs(logsList);
    }

    verifyFavoriteAndLogs();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    async function loadCurrencies() {
      const data = await getCurrencies();
      setCurrencies(data);
    }

    loadCurrencies();
  }, []);

  useEffect(() => {
    startTransition(async () => {
      const { value, result } = await convertCurrency(
        amount,
        fromCurrency,
        toCurrency,
      );
      setValue(value);
      setResult(result);
    });
  }, [amount, toCurrency, fromCurrency]);

  return (
    <>
      <LiveMarkets
        setFromCurrency={setFromCurrency}
        setToCurrency={setToCurrency}
      />
      <main className='w-full xl:w-4/5'>
        <section className='my-12 mx-6 xl:mx-8 flex flex-col gap-4'>
          <h1 className='text-xl text-neutral-50'>CHECK THE RATE</h1>
          <div className='bg-neutral-700 rounded-lg'>
            <div className='flex flex-col sm:flex-row items-stretch gap-4 w-full border-b border-dashed border-neutral-500 p-4 md:p-5'>
              <div className='flex-1 bg-neutral-600 p-4 rounded-lg border border-neutral-500 flex flex-col gap-3'>
                <h1 className='text-sm text-neutral-100'>SEND</h1>
                <div className='flex flex-row items-start sm:items-center gap-3'>
                  <input
                    className='w-2/3 sm:flex-1 h-10 bg-transparent text-3xl sm:text-4xl text-neutral-50 focus:border focus:border-lime-500 focus:outline-0 focus:rounded-lg hover:border-b hover:border-b-neutral-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-inner-spin-button]:appearance-none'
                    type='number'
                    name='convert'
                    id='convert'
                    defaultValue={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    disabled={isPending}
                  />
                  <CurrencyPicker
                    currencies={currencies}
                    setValue={setFromCurrency}
                    value={fromCurrency}
                    value2={toCurrency}
                    setIsVisible={setSendIsVisible}
                    isVisible={sendIsVisible}
                    setVisible={setConvertIsVisible}
                  />
                </div>
              </div>

              <div
                className='self-center flex items-center justify-center bg-neutral-600 hover:bg-neutral-500 h-fit p-3 rounded-lg border border-neutral-500 cursor-pointer active:border-lime-500 shrink-0'
                onClick={() => {
                  setFromCurrency(toCurrency);
                  setToCurrency(fromCurrency);
                  setAmount(1000);
                }}
              >
                <LiaExchangeAltSolid className='text-neutral-50 text-2xl rotate-90 sm:rotate-0' />
              </div>

              <div className='flex-1 bg-neutral-600 p-4 rounded-lg border border-neutral-500 flex flex-col gap-3'>
                <h1 className='text-sm text-neutral-100'>CONVERT</h1>
                <div className='flex flex-row items-start sm:items-center gap-3'>
                  <h1 className='w-2/3 sm:flex-1 h-10 text-3xl sm:text-4xl text-neutral-50 hover:border-b hover:border-b-neutral-200'>
                    {result?.toFixed(2)}
                  </h1>
                  <CurrencyPicker
                    currencies={currencies}
                    setValue={setToCurrency}
                    value={toCurrency}
                    value2={fromCurrency}
                    setIsVisible={setConvertIsVisible}
                    isVisible={convertIsVisible}
                    setVisible={setSendIsVisible}
                  />
                </div>
              </div>
            </div>
            <div className='p-5 flex gap-4 sm:gap-0 flex-col sm:flex-row sm:justify-between sm:items-center'>
              <div className='flex sm:block justify-center'>
                <h1 className='text-xs text-neutral-50'>
                  1 {fromCurrency} = {value?.toFixed(2)} {toCurrency}
                </h1>
              </div>
              <div className='flex gap-3 justify-center'>
                <button
                  className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium cursor-pointer ${isFavorite ? 'bg-lime-500 border-lime-500 text-neutral-900' : 'bg-neutral-600 hover:bg-neutral-500 border-neutral-500 text-neutral-50'} active:border-lime-500 active:ring-1 active:ring-lime-500 active:ring-offset-2 active:ring-offset-neutral-700`}
                  onClick={() => favoriteBtnFn()}
                >
                  {isFavorite ? <BsStarFill /> : <BsStar />}
                  {isFavorite ? 'FAVORITED' : 'FAVORITE'}
                </button>
                <button
                  className='flex items-center gap-2 px-3 py-2 bg-neutral-600 border border-lime-500 rounded-lg text-xs text-neutral-50 font-medium cursor-pointer hover:bg-lime-800 active:ring-1 active:ring-lime-500 active:ring-offset-2 active:ring-offset-neutral-700'
                  onClick={() => logBtnFn()}
                >
                  LOG CONVERSION
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className='my-12 mx-6 xl:mx-8 flex flex-col gap-4'>
          <div className='flex flex-col gap-5'>
            <div>
              <TabsMenu
                logs={logs}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                favorites={favorites}
              />
            </div>
            {selectedTab === 'History' && (
              <HistoryContainer
                fromCurrency={fromCurrency}
                toCurrency={toCurrency}
              />
            )}
            {selectedTab === 'Compare' && (
              <CompareContainer
                fromCurrency={fromCurrency}
                currencies={currencies}
                amount={amount}
                setToCurrency={setToCurrency}
              />
            )}
            {selectedTab === 'favorite' && (
              <FavoriteContainer
                setFromCurrency={setFromCurrency}
                setToCurrency={setToCurrency}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            )}

            {selectedTab === 'Log' && (
              <LogContainer
                logs={logs}
                setLogs={setLogs}
                setFromCurrency={setFromCurrency}
                setToCurrency={setToCurrency}
              />
            )}
          </div>
        </section>
      </main>
    </>
  );
}
