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
