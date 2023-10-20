import { RandomGenerator } from './random.generator';

const ASCII =
  '!"#$%&\'()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz0123456789{|}~'.split(
    '',
  );
const HEX = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

describe('RandomGenerator', () => {
  let randomGenerator: RandomGenerator;

  beforeAll(() => {
    randomGenerator = new RandomGenerator();
  });

  it('should generate valid ASCII', () => {
    for (let i = 1; i < 100; i++) {
      const ascii = randomGenerator.ascii(i);

      expect(ascii).toHaveLength(i);
      expect(ascii.split('').every((e) => ASCII.includes(e))).toBeTruthy();
    }
  });

  it('should generate valid HEX', () => {
    for (let i = 1; i < 100; i++) {
      const hex = randomGenerator.hex(i);

      expect(hex).toHaveLength(i);
      expect(hex.split('').every((e) => HEX.includes(e))).toBeTruthy();
    }
  });

  it('should generate valid int range', () => {
    for (let i = 1; i < 100; i++) {
      const randomInt = randomGenerator.int(-i, i);

      expect(randomInt).toBeLessThanOrEqual(i);
      expect(randomInt).toBeGreaterThanOrEqual(-i);
    }
  });

  it('should generate valid num range', () => {
    for (let i = 1; i < 100; i++) {
      const randomInt = randomGenerator.number(-i, i);

      expect(randomInt).toBeLessThanOrEqual(i);
      expect(randomInt).toBeGreaterThanOrEqual(-i);
    }
  });
});
