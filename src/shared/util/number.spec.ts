import { Decimal } from 'decimal.js';

import { decimalDigitsLen, generateNumRange, numDigitsLen } from './number';

describe('number utils', () => {
  it('should generate num range from 1 to 30 step 4', () => {
    const numRange = generateNumRange(1, 30, 4);

    expect(numRange).toStrictEqual([1, 5, 9, 13, 17, 21, 25, 29]);
  });

  it('should generate float step num range from 5 to 10', () => {
    const numRange = generateNumRange(5, 6.2, 0.2);

    expect(numRange).toStrictEqual([5, 5.2, 5.4, 5.6, 5.8, 6, 6.2]);
  });

  it('should return correct number of digits', () => {
    expect(numDigitsLen(1.7)).toEqual(1);
    expect(numDigitsLen(12.2)).toEqual(2);
    expect(numDigitsLen(105)).toEqual(3);
    expect(numDigitsLen(1505.321321553)).toEqual(4);
    expect(numDigitsLen(15095.0)).toEqual(5);
  });

  it('should return correct number of digits (decimal.js)', () => {
    expect(decimalDigitsLen(new Decimal(1.7))).toEqual(new Decimal(1));
    expect(decimalDigitsLen(new Decimal(99.99999))).toEqual(new Decimal(2));
    expect(decimalDigitsLen(new Decimal(643))).toEqual(new Decimal(3));
    expect(decimalDigitsLen(new Decimal(1321.413413))).toEqual(new Decimal(4));
    expect(decimalDigitsLen(new Decimal(64217))).toEqual(new Decimal(5));
  });
});
