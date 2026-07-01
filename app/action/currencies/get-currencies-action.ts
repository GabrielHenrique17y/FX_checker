'use server';

export async function getCurrencies() {
  try {
    const res = await fetch('https://api.frankfurter.app/currencies', {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!res.ok) {
      throw new Error('Request failed');
    }

    const data = await res.json();

    return data as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}
