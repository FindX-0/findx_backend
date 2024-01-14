export const groupByToMap = <Q, T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => Q,
) =>
  array.reduce((map, value, index, array) => {
    const key = predicate(value, index, array);
    map.get(key)?.push(value) ?? map.set(key, [value]);
    return map;
  }, new Map<Q, T[]>());

export const partition = <T>(
  array: T[],
  predicate: (t: T, index: number, array: T[]) => boolean,
): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];

  array.forEach((e, idx, arr) =>
    (predicate(e, idx, arr) ? pass : fail).push(e),
  );

  return [pass, fail];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const arrayCopy = [...array];

  let currentIndex = arrayCopy.length;
  let randomIndex = -1;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arrayCopy[currentIndex] as unknown, arrayCopy[randomIndex] as unknown] = [
      arrayCopy[randomIndex],
      arrayCopy[currentIndex],
    ];
  }

  return arrayCopy;
};

export const arrayEqualsIgnoreOrder = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const seen: Record<string, number> = {};

  a.forEach((v) => {
    const key = typeof v + v;
    if (!seen[key]) {
      seen[key] = 0;
    }
    seen[key] += 1;
  });

  return b.every((v) => {
    const key = typeof v + v;

    if (seen[key]) {
      seen[key] -= 1;
      return true;
    }

    return false;
  });
};

type Iterableify<T> = { [K in keyof T]: Iterable<T[K]> };

export function* product<T extends Array<unknown>>(
  ...iterables: Iterableify<T>
): Generator<T> {
  if (iterables.length === 0) {
    return;
  }
  const iterators = iterables.map((it) => it[Symbol.iterator]());
  const results = iterators.map((it) => it.next());

  // Cycle through iterators
  for (let i = 0; ; ) {
    if (results[i] && results[i]!.done) {
      // Reset the current iterator
      if (iterables[i]) {
        iterators[i] = iterables[i]![Symbol.iterator]();
      }

      if (iterators[i]) {
        results[i] = iterators[i]!.next();
      }

      // Advance and exit if we've reached the end
      if (++i >= iterators.length) {
        return;
      }
    } else {
      yield results.map(({ value }) => value) as T;
      i = 0;
    }

    if (iterators[i]) {
      results[i] = iterators[i]!.next();
    }
  }
}

export function* arrayChunks<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}
