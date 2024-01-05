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
