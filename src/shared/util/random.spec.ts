import { randomASCII, randomHEX, randomInt, randomNumber } from './random';

const ASCII =
  '!"#$%&\'()*+,-./:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz0123456789{|}~'.split(
    '',
  );
const HEX = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

describe('random', () => {
  it('should generate valid ASCII', () => {
    for (let i = 1; i < 100; i++) {
      const value = randomASCII(i);

      expect(value).toHaveLength(i);
      expect(value.split('').every((e) => ASCII.includes(e))).toBeTruthy();
    }
  });

  it('should generate valid HEX', () => {
    for (let i = 1; i < 100; i++) {
      const value = randomHEX(i);

      expect(value).toHaveLength(i);
      expect(value.split('').every((e) => HEX.includes(e))).toBeTruthy();
    }
  });

  it('should generate valid int range', () => {
    for (let i = 1; i < 100; i++) {
      const value = randomInt(-i, i);

      expect(value).toBeLessThanOrEqual(i);
      expect(value).toBeGreaterThanOrEqual(-i);
    }
  });

  it('should generate valid num range', () => {
    for (let i = 1; i < 100; i++) {
      const value = randomNumber(-i, i);

      expect(value).toBeLessThanOrEqual(i);
      expect(value).toBeGreaterThanOrEqual(-i);
    }
  });
});
