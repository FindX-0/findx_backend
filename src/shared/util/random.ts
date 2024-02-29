import { v4 as v4Uuid } from 'uuid';

import { primeFactors } from './number';

const ASCII =
  '!"#$%&\'()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz0123456789{|}~';
const HEX = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const uuidV4 = (): string => {
  return v4Uuid();
};

export const randomBoolean = (): boolean => {
  return Math.random() < 0.5;
};

export const randomSign = (): number => {
  return randomBoolean() ? -1 : 1;
};

export const randomASCII = (length: number): string => {
  return randomString(length, ASCII);
};

export const randomHEX = (length: number): string => {
  return randomString(length, HEX);
};

/**
 * @returns generated random integer from min to max inclusive
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomIntAsString = (min: number, max: number): string => {
  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  return number.toString();
};

export const randomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomElement = <T>(arr: T[]): T | null => {
  if (!arr.length) {
    return null;
  }

  const randomIndex = randomInt(0, arr.length - 1);

  return arr[randomIndex] ?? null;
};

export const randomPrime = (num: number): number | null => {
  const primes = primeFactors(num);

  if (!primes.length) {
    return null;
  }

  return randomElement(primes);
};

const randomString = (length: number, charset: string): string => {
  const len = charset.length;

  let s = '';
  for (let i = 0; i < length; i++) {
    s += charset.charAt(Math.floor(Math.random() * len));
  }

  return s;
};

interface WeightedSelectable {
  weight: number;
}

export const weightedRandom = <T extends WeightedSelectable>(
  options: T[],
): T | null => {
  let i;

  const firstOption = options[0];
  if (!firstOption) {
    return null;
  }
  const weights = [firstOption.weight];

  for (i = 1; i < options.length; i++) {
    const option = options[i];
    const weight = weights[i - 1];

    if (!option || !weight) {
      continue;
    }

    weights[i] = option.weight + weight;
  }

  const lastWeight = weights[weights.length - 1];
  if (!lastWeight) {
    return null;
  }

  const random = Math.random() * lastWeight;

  for (i = 0; i < weights.length; i++) {
    const weight = weights[i];
    if (!weight) {
      continue;
    }

    if (weight > random) break;
  }

  return options[i] ?? null;
};
