'use server';

import { Period } from '@/app/types/period';

const periodDays: Record<Period, number> = {
  '5D': 5,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  '5Y': 1826,
};

export async function getIntervalValueData(
  from: string,
  to: string,
  period: Period,
) {
  const endDate = new Date();

  const startDate = new Date();
  startDate.setDate(endDate.getDate() - periodDays[period]);

  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  try {
    const res = await fetch(
      `https://api.frankfurter.app/${start}..${end}?from=${from}&to=${to}`,
      {
        next: {
          revalidate: 60 * 60,
        },
      },
    );

    if (!res.ok) {
      throw new Error('Request failed');
    }

    const data = await res.json();

    return Object.entries(data.rates).map(([date, rates]) => ({
      date,
      value: (rates as Record<string, number>)[to],
    }));
  } catch {
    return [];
  }
}
