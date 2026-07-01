'use server';

export async function convertCurrency(
  amount: number,
  from: string,
  to: string,
) {
  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=${from}&to=${to}`,
      {
        next: {
          revalidate: 60 * 60 * 3,
        },
      },
    );

    if (!res.ok) {
      throw new Error('Request failed');
    }

    const data = await res.json();

    const rate = data?.rates?.[to];

    if (typeof rate !== 'number') {
      return { value: 0, result: 0 };
    }

    return {
      value: rate,
      result: rate * amount,
    };
  } catch {
    return {
      value: 0,
      result: 0,
    };
  }
}
