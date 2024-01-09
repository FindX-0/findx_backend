import { Decimal } from 'decimal.js';

export const splitNumIntoChunks = (
  num: number,
  chunkSize: number,
): number[] => {
  let number = num;
  const chunks = [];

  while (number > 0) {
    chunks.push(Math.min(number, chunkSize));
    number = number - chunkSize;
  }

  return chunks;
};

export const generateNumRange = (
  min: number,
  max: number,
  step: number,
): number[] => {
  return Array.from(
    { length: (max - min) / step + 1 },
    (_, i) => min + i * step,
  );
};

export const primeFactors = (n: number): number[] => {
  let positiveN = Math.abs(n);

  const arr: number[] = [];
  let i = 2;
  while (i <= positiveN) {
    if (positiveN % i !== 0) {
      i++;
      continue;
    }

    positiveN = positiveN / i;
    arr.push(i);
  }

  return arr;
};

export const numDigits = (num: number): number => {
  return Math.max(Math.floor(Math.log10(Math.abs(num))), 0) + 1;
};

export const decimalDigits = (num: Decimal): Decimal => {
  return Decimal.max(num.abs().log(10).floor(), 0).add(1);
};
