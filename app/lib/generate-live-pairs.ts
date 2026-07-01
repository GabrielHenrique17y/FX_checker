import seedrandom from 'seedrandom';
import { FIXED_PAIRS } from './constantes';

export function generateLivePairs<C extends string>(currencies: C[]) {
  const seed = new Date().toLocaleDateString('en-CA');
  const rng = seedrandom(seed);

  const pairs = [...FIXED_PAIRS] as Array<[C, C]>;

  const used = new Set(FIXED_PAIRS.map(([a, b]) => `${a}-${b}`));

  let attempts = 0;
  const maxAttempts = 200;

  while (pairs.length < 20 && attempts < maxAttempts) {
    attempts++;

    const from = currencies[Math.floor(rng() * currencies.length)];
    const to = currencies[Math.floor(rng() * currencies.length)];

    if (from === to) continue;

    const key = `${from}-${to}`;
    const inverseKey = `${to}-${from}`;

    if (used.has(key) || used.has(inverseKey)) continue;

    used.add(key);
    pairs.push([from, to]);
  }

  return pairs;
}
