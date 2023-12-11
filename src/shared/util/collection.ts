export const groupByToMap = <T, Q>(
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
