'use server';

import { generateLivePairs } from '@/app/lib/generate-live-pairs';

async function fetchRates(date?: string) {
  const res = await fetch(
    `https://api.frankfurter.app/${date ?? 'latest'}?base=EUR`,
    {
      next: {
        revalidate: 60 * 60 * 24,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Frankfurter API error: ${res.status}`);
  }

  const data = await res.json();

  return data.rates as Record<string, number>;
}

function getDateOffset(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

function getRate(from: string, to: string, rates: Record<string, number>) {
  if (from === 'EUR') return rates[to];
  if (to === 'EUR') return 1 / rates[from];
  return rates[to] / rates[from];
}

export async function getLiveMarkets() {
  const currencies = Object.keys(await fetchRates());

  currencies.push('EUR');

  const pairs = generateLivePairs(currencies);

  const [current, previous] = await Promise.all([
    fetchRates(),
    fetchRates(getDateOffset(5)),
  ]);

  return pairs.map(([from, to]) => {
    const currentRate = getRate(from, to, current);
    const previousRate = getRate(from, to, previous);

    const changePercent = ((currentRate - previousRate) / previousRate) * 100;

    return {
      from,
      to,
      rate: currentRate,
      changePercent,
    };
  });
}
