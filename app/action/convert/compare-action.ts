'use server';

export async function compareCurrency(
  amount: number,
  code: string,
  to: string,
) {
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?base=${code}`, {
      next: {
        revalidate: 60 * 60 * 24
      }
    });

    if (!res.ok) {
      throw new Error('Request failed');
    }

    const data = await res.json();

    const value = data?.rates?.[to];

    if (typeof value !== 'number') {
      return { value: 0, result: 0 };
    }

    return {
      value,
      result: value * amount,
    };
  } catch {
    return { value: 0, result: 0 };
  }
}
